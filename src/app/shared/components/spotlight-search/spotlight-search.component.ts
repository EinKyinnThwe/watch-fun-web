import { 
    CommonModule 
} from "@angular/common";

import { 
    ChangeDetectorRef,
    Component, 
    ElementRef, 
    HostListener, 
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";

import { 
    FormsModule 
} from "@angular/forms";

import { 
    TmdbService 
} from "../../../core/services/tmdb.service";

import { 
    SpotLightSearchService 
} from "../../../core/services/spotlight-search.service";

import { 
    Router 
} from "@angular/router";

import { 
    MultiSearchItem 
} from "../../models/movie.model";

import { 
    debounceTime,
    distinctUntilChanged,
    forkJoin,
    map,
    of,
    Subject, 
    switchMap, 
    takeUntil,
    tap
} from "rxjs";
import { MovieDetailsService } from "../../../core/services/movie-details.service";


const RECENT_SEARCHES_KEY = 'spotlight-recent-searches';
const MAX_RECENT = 6;
const EXIT_ANIMATION_MS = 500;

@Component({
    selector: 'app-spotlight-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div
            *ngIf="rendered"
            class="fixed inset-0 z-[9999] flex justify-center px-4 pt-[13vh] ..."
            [class.opacity-100]="visible"
            [class.opacity-0]="!visible"
            style="backdrop-filter: blur(3px); background-color: rgba(0,0,0,0.35); border: 4px;"
            (click)="onBackdropClick($event)"
        >
            <div
                class = "h-fit w-[90%] max-w-2xl origin-top overflow-hidden rounded-2xl ring-1 ring-white/[0.12] shadow-glass transition-all duration-500 ease-spring"
                [class.opacity-100] = "visible"
                [class.scale-100] = "visible"
                [class.opacity-0] = "!visible"
                [class.scale-95] = "!visible"
                style="background-color: rgba(42, 42, 44, 0.55);"
                (click)="$event.stopPropagation()"
                (touchstart)="onTouchStart($event)"
                (touchend)="onTouchEnd($event)"
            >
                <div
                    class = "flex items-center gap-3 border-b border-white/10 px-5 py-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        class="h-5 w-5 shrink-0 text-[#a1a1aa]"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path stroke-linecap="round" d="M21 21l-4.35-4.35" />
                    </svg>
                    
                    <input 
                        #searchInput
                        type="text"
                        [ngModel]="query"
                        (ngModelChange)="onQueryChange($event)"
                        placeholder="Search movies, actors, directors..."
                        class="min-w-0 flex-1 border-none bg-transparent text-md text-white outline-none placeholder:text-[#a1a1aa]"
                    />
                    
                    <button
                        *ngIf="query"
                        type="button"
                        (click)="clearQuery()"
                        aria-label="Clear search"
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-muted hover:bg-white/20 hover:text-white"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-width="2.5" 
                            class="h-3 w-3"
                        >
                            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        (click)="close()"
                        class="shrink-0 text-sm font-semibold text-[#e50914] hover:text-white"
                    >
                        Cancel
                    </button>
                </div>

                <!-- Body -->
                <div class="max-h-[65vh] overflow-y-auto transition-[max-height] duration-300 ease-spring scrollbar-hide">
                    <!-- Empty / initial state -->
                    <div *ngIf="!query.trim()" class="space-y-6 p-5">
                        <div *ngIf="recentSearches.length">
                            <h3 class="mb-2 text-xs uppercase tracking-wide text-white">Recent Searches</h3>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    *ngFor="let term of recentSearches"
                                    type="button"
                                    (click)="selectTerm(term)"
                                    class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                                >
                                    {{ term }}
                                    <span
                                        (click)="removeRecent(term, $event)"
                                        class="text-muted hover:text-white"
                                        role="button"
                                        [attr.aria-label]="'Remove ' + term + ' from recent searches'"
                                    >
                                        ✕
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div *ngIf="trendingSearches.length">
                            <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-white">Trending Searches</h3>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    *ngFor="let term of trendingSearches"
                                    type="button"
                                    (click)="selectTerm(term)"
                                    class="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/20"
                                >
                                    🔥 {{ term }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Loading (debounced query in flight) -->
                    <div *ngIf="query.trim() && loading" class="space-y-3 p-5">
                        <div *ngFor="let i of [1, 2, 3]" class="flex animate-pulse gap-3">
                            <div class="h-[60px] w-10 shrink-0 rounded-md bg-surface"></div>
                            <div class="flex-1 space-y-2 py-2">
                                <div class="h-3 w-2/3 rounded bg-surface"></div>
                                <div class="h-3 w-1/3 rounded bg-surface"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Results -->
                    <div *ngIf="query.trim() && !loading">
                        <ng-container *ngIf="movieResults.length || personResults.length; else noResults">
                        <div 
                            *ngIf="movieResults.length" class="p-2"
                        >
                            <h3 
                                class="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-white"
                            >
                                Movies
                            </h3>
                            <button
                                *ngFor="let movie of movieResults"
                                type="button"
                                (click)="selectMovie(movie)"
                                class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/5"
                            >
                            <img
                                *ngIf="tmdb.getImageUrl(movie.poster_path ?? null, 'w185') as posterUrl; else noPoster"
                                [src]="posterUrl"
                                [alt]="movie.title"
                                class="h-[60px] w-10 shrink-0 rounded-md object-cover"
                            />
                            <ng-template #noPoster>
                                <div class="flex h-[60px] w-10 shrink-0 items-center justify-center rounded-md bg-surface text-[9px] text-[#a1a1aa]">
                                    N/A
                                </div>
                            </ng-template>

                            <div class="min-w-0 flex-1">
                                <p 
                                    class="truncate text-sm font-semibold text-white"
                                >
                                    {{ movie.title }}
                                </p>
                                <p 
                                    class="truncate text-xs text-[#a1a1aa]"
                                >
                                    {{ releaseYear(movie.release_date) }}
                                <span *ngIf="genreName(movie.genre_ids)"> · {{ genreName(movie.genre_ids) }}</span>
                                </p>
                            </div>

                            <span
                                *ngIf="movie.vote_average"
                                class="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#f5c518]"
                            >
                                ★ {{ movie.vote_average | number: '1.1-1' }}
                            </span>
                            </button>
                        </div>

                        <div *ngIf="personResults.length" class="border-t border-white/10 p-2">
                            <h3 class="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-white">Cast &amp; Crew</h3>
                            <div *ngFor="let person of personResults" class="flex items-center gap-3 rounded-lg px-3 py-2">
                            <img
                                *ngIf="tmdb.getImageUrl(person.profile_path ?? null, 'w185') as photoUrl; else noPhoto"
                                [src]="photoUrl"
                                [alt]="person.name"
                                class="h-10 w-10 shrink-0 rounded-full object-cover"
                            />
                            <ng-template #noPhoto>
                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-xs text-white">
                                    ?
                                </div>
                            </ng-template>
                            <div class="min-w-0">
                                <p class="truncate text-sm font-semibold text-white">{{ person.name }}</p>
                                <p class="truncate text-xs text-white">{{ person.known_for_department }}</p>
                            </div>
                            </div>
                        </div>
                        </ng-container>

                        <ng-template #noResults>
                        <div class="flex flex-col items-center justify-center gap-2 py-16 text-center">
                            <div class="text-3xl">🔍</div>
                            <p class="font-semibold text-white">No movies found for "{{ query }}"</p>
                            <p class="text-sm text-white">Try a different title, actor, or director.</p>
                        </div>
                        </ng-template>
                    </div>
                </div>
            </div>
        </div>
    `,
})

export class SpotLightSearchComponent implements OnInit, OnDestroy{
    @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;
    private cdr = inject(ChangeDetectorRef);

    tmdb = inject(TmdbService);
    private spotlight = inject(SpotLightSearchService);
    private movieModal = inject(MovieDetailsService);
    
    rendered = false;
    visible = false;
    query = '';
    loading = false;
    
    movieResults: MultiSearchItem[] = [];
    personResults: MultiSearchItem[] = [];
    genreMap: Record<number, string> = {};
    recentSearches: string[] = [];
    trendingSearches: string[] = [];

    private touchStartY = 0;
    private closeTimeout?: ReturnType<typeof setTimeout>;
    private readonly queryChanges$ = new Subject<string>();
    private readonly destroy$ = new Subject<void>();
    
    ngOnInit(): void {
        this.recentSearches = this.loadRecentSearches();

        this.tmdb.getGenreMap().pipe(takeUntil(this.destroy$)).subscribe((map) => {
            this.genreMap = map;
        });

        this.tmdb.getTrending('day').pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                this.trendingSearches = response.results.slice(0, 5).map((m) => m.title);
            },
            error: () => {
                // Fall back to static examples if the trending call fails.
                this.trendingSearches = ['Oppenheimer', 'Dune 2', 'Barbie', 'Inception'];
            },
        });

        this.spotlight.isOpen$.pipe(takeUntil(this.destroy$)).subscribe((open) => {
            open ? this.handleOpen() : this.handleClose();
        });

        this.queryChanges$
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                tap((q) => {
                    this.loading = !!q.trim();
                    this.cdr.detectChanges();
                }),
                switchMap((q) => {
                    const term = q.trim();
                    if (!term) return of(null);

                    // Load first 3 pages in parallel
                    return forkJoin([
                        this.tmdb.searchMulti(term, 1),
                        this.tmdb.searchMulti(term, 2),
                        this.tmdb.searchMulti(term, 3),
                    ]).pipe(
                        map((pages) => {
                            const allResults = pages.flatMap((p) => p.results);
                            return {
                                results: allResults,
                                total_results: pages[0]?.total_results ?? allResults.length,
                            };
                        })
                    );
                }),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (response) => {
                    this.loading = false;

                    if (!response) {
                        this.movieResults = [];
                        this.personResults = [];
                        this.cdr.detectChanges();
                        return;
                    }

                    this.movieResults = response.results
                        .filter((r) => r.media_type === 'movie')
                        .slice(0, 15);

                    this.personResults = response.results
                        .filter((r) => r.media_type === 'person')
                        .slice(0, 6);

                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Search error:', err);
                    this.loading = false;
                    this.movieResults = [];
                    this.personResults = [];
                    this.cdr.detectChanges();
                },
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        clearTimeout(this.closeTimeout);
    }

    @HostListener('document:keydown.escape')
    onEscapeKey(): void {
        if (this.rendered) this.close();
    }

    private handleOpen(): void {
        clearTimeout(this.closeTimeout);
        this.rendered = true;
        this.cdr.detectChanges(); // Forces *ngIf="rendered" to mount to the DOM

        requestAnimationFrame(() => {
            this.visible = true;
            this.cdr.detectChanges(); // Triggers CSS transition to visible
            setTimeout(() => this.searchInputRef?.nativeElement.focus(), 50);
        });
    }

    private handleClose(): void {
        this.visible = false;
        this.cdr.detectChanges();
        clearTimeout(this.closeTimeout);
        this.closeTimeout = setTimeout(() => {
            this.rendered = false;
            this.query = '';
            this.movieResults = [];
            this.personResults = [];
            this.loading = false;
            this.cdr.detectChanges();
        }, EXIT_ANIMATION_MS);
    }

    close(): void {
        this.spotlight.close();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.close();
    }

    onQueryChange(value: string): void {
        this.query = value;
        this.queryChanges$.next(value);
    }

    clearQuery(): void {
        this.query = '';
        this.queryChanges$.next('');
        this.searchInputRef?.nativeElement.focus();
    }

    selectTerm(term: string): void {
        this.query = term;
        this.onQueryChange(term);
    }

    selectMovie(movie: MultiSearchItem): void {
        this.saveRecentSearch(this.query.trim() || movie.title || '');
        this.close();
        this.movieModal.open(movie.id);
    }

    removeRecent(term: string, event: Event): void {
        event.stopPropagation();
        this.recentSearches = this.recentSearches.filter((t) => t !== term);
        this.persistRecentSearches();
    }

    onTouchStart(event: TouchEvent): void {
        this.touchStartY = event.touches[0].clientY;
    }

    onTouchEnd(event: TouchEvent): void {
        const delta = event.changedTouches[0].clientY - this.touchStartY;
        if (delta > 80) this.close(); // swipe down to dismiss
    }

    genreName(genreIds: number[] | undefined): string {
        const id = genreIds?.[0];
        return id !== undefined ? this.genreMap[id] || '' : '';
    }

    releaseYear(dateString: string | undefined): string {
        return dateString ? dateString.split('-')[0] : '';
    }

    private loadRecentSearches(): string[] {
        try {
            const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
            return raw ? (JSON.parse(raw) as string[]) : [];
        } catch {
            return [];
        }
    }

    private persistRecentSearches(): void {
        try {
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(this.recentSearches));
        } catch {
            // Storage unavailable (private browsing, quota, etc.) — non-fatal.
        }
    }

    private saveRecentSearch(term: string): void {
        if (!term.trim()) return;
        this.recentSearches = [term, ...this.recentSearches.filter((t) => t !== term)].slice(0, MAX_RECENT);
        this.persistRecentSearches();
    }
}
