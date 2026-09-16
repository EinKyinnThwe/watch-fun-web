import { 
    CommonModule 
} from "@angular/common";

import { 
    ChangeDetectorRef,
    Component, 
    HostListener, 
    inject, 
    OnDestroy, 
    OnInit
} from "@angular/core";
import { MovieDetailsService } from "../../../core/services/movie-details.service";
import { TmdbService } from "../../../core/services/tmdb.service";
import { FavoritesService } from "../../../core/services/favorites.service";
import { FirestoreService } from "../../../core/services/firestore.service";
import { AuthService } from "../../../core/services/auth.service";
import { Movie, MovieDetails } from "../../models/movie.model";
import { Subject, takeUntil } from "rxjs";
import { FavoriteButtonComponent } from "../favorite-button/favorite-button.component";
import { LoadingSkeletonComponent } from "../loading-skeleton/loading-skeleton.component";
import { RatingComponent } from "../rating/rating.component";

const EXIT_ANIMATION_MS = 700;

@Component({
    selector: 'app-movie-details-overlay',
    standalone: true,
    imports: [CommonModule, FavoriteButtonComponent, LoadingSkeletonComponent, RatingComponent],
    template: `
        <div
            *ngIf="rendered"
            class="fixed inset-0 z-[100] flex justify-center overflow-y-auto px-4 py-[6vh] transition-opacity duration-300 sm:py-[8vh]"
            [class.opacity-100]="visible"
            [class.opacity-0]="!visible"
            style="backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(3px); background-color: rgba(0,0,0,0.35);"
            (click)="onBackdropClick($event)"
        >
            <div
                class="h-fit w-[90%] max-w-4xl origin-top overflow-hidden rounded-2xl ring-1 ring-white/[0.12] shadow-glass transition-all duration-300 ease-spring"
                [class.opacity-100]="visible"
                [class.scale-100]="visible"
                [class.opacity-0]="!visible"
                [class.scale-95]="!visible"
                style="background-color: rgba(42, 42, 44, 0.55);"
                (click)="$event.stopPropagation()"
                (touchstart)="onTouchStart($event)"
                (touchend)="onTouchEnd($event)"
            >
                <!-- Close button, floats above everything -->
                <button
                    type="button"
                    (click)="close()"
                    aria-label="Close"
                    class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/90 cursor-pointer"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2.5" 
                        class="h-4 w-4"
                    >
                        <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>

                <div 
                    class="max-h-[85vh] overflow-y-auto scrollbar-hide"
                >
                
                <app-loading-skeleton *ngIf="loading" variant="detail" />

                <div 
                    *ngIf="!loading && errorMessage" 
                    class="px-4 py-20 text-center text-white"
                >
                    {{ errorMessage }}
                </div>

                <ng-container 
                    *ngIf="!loading && movie as m"
                >
                    <!-- Backdrop, scoped to the card instead of full viewport -->
                    <section 
                        class="relative h-[30vh] min-h-[220px] w-full overflow-hidden sm:h-[38vh]"
                    >
                        <img
                            *ngIf="backdropUrl"
                            [src]="backdropUrl"
                            [alt]="m.title"
                            class="absolute inset-0 h-full w-full object-cover object-top"
                        />
                        <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(30,30,35,0.95), rgba(30,30,35,0.2));"></div>
                    </section>

                    <div 
                        class="px-5 pb-8 pt-0 sm:px-8"
                    >
                        <div 
                            class="flex flex-col gap-5 sm:flex-row sm:-mt-1"
                        >
                            <img
                                *ngIf="posterUrl"
                                [src]="posterUrl"
                                [alt]="m.title"
                                class="w-32 shrink-0 rounded-xl shadow-card-hover ring-1 ring-white/10 sm:w-44"
                            />

                            <div 
                                class="flex-1 pt-2 sm:pt-26"
                            >
                                <h1 
                                    class="text-2xl font-black text-white sm:text-3xl"
                                >
                                    {{ m.title }}
                                </h1>
                                <p 
                                    *ngIf="m.tagline" 
                                    class="mt-1 italic text-white"
                                >
                                    {{ m.tagline }}
                                </p>

                                <div 
                                    class="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-300"
                                >
                                    <app-rating *ngIf="m.vote_average" [value]="m.vote_average" size="md" class = "text-[#f5c518]"/>
                                    
                                    <span 
                                        *ngIf="m.runtime"
                                    >
                                        {{ formatRuntime(m.runtime) }}
                                    </span>
                                    
                                    <span>
                                        {{ releaseYear }}
                                    </span>
                                    
                                    <span 
                                        *ngFor="let genre of m.genres"
                                    >
                                        <span 
                                            class="rounded-full border border-white/15 px-3 py-1 text-xs"
                                        >
                                            {{ genre.name }}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p 
                            class="mt-6 max-w-2xl text-sm leading-relaxed text-gray-200 sm:text-base"
                        >
                            {{ m.overview }}
                        </p>

                        <div 
                            *ngIf="director" 
                            class="mt-5 text-sm"
                        >
                            <span 
                                class="font-semibold text-white"
                            >
                                Director: 
                            </span>
                            
                            <span 
                                class="text-gray-300"
                            >
                                {{ director }}
                            </span>
                        </div>

                        <div 
                            *ngIf="m.production_companies?.length" 
                            class="mt-1 text-sm"
                        >
                            <span 
                                class="font-semibold text-white"
                            >
                                Studio: 
                            </span>
                            <span 
                                class="text-gray-300"
                            >
                                {{ studioNames }}
                            </span>
                        </div>

                        <div 
                            class="mt-6 flex flex-wrap gap-3"
                        >
                            <button
                                type="button"
                                class="flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 font-bold text-white shadow-glow-primary transition hover:brightness-110 cursor-pointer"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor" 
                                    class="h-7 w-7"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Play
                            </button>
                            <app-favorite-button
                                *ngIf="auth.currentUser"
                                [isFavorite]="isFavorite"
                                [loading]="favoriteLoading"
                                (toggled)="toggleFavorite()"
                            />
                        </div>

                        <!-- Cast -->
                        <section 
                            *ngIf="cast.length" 
                            class="mt-10"
                        >
                            <h2 
                                class="mb-3 text-lg font-bold text-white"
                            >
                                Cast
                            </h2>
                            
                            <div 
                                class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                            >
                                <div 
                                    *ngFor="let actor of cast" 
                                    class="w-20 shrink-0 text-center sm:w-24"
                                >
                                    <img
                                        *ngIf="tmdb.getImageUrl(actor.profile_path, 'w185') as profileUrl; else noProfile"
                                        [src]="profileUrl"
                                        [alt]="actor.name"
                                        class="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                                    />
                                    <ng-template 
                                        #noProfile
                                    >
                                        <div 
                                            class="flex h-20 w-20 items-center justify-center rounded-full bg-surface text-xs text-white sm:h-24 sm:w-24"
                                        >
                                            No photo
                                        </div>
                                    </ng-template>
                                    <p 
                                        class="mt-2 truncate text-xs font-semibold text-white"
                                    >
                                        {{ actor.name }}
                                    </p>
                                    <p 
                                        class="truncate text-xs text-white"
                                    >
                                        {{ actor.character }}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- Similar movies -->
                        <section 
                            *ngIf="m.similar?.results?.length" 
                            class="mt-10"
                        >
                            <h2 
                                class="mb-3 text-lg font-bold text-white"
                            >
                                Similar Movies
                            </h2>
                            
                                <div 
                                    class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                                >
                                    <button
                                        *ngFor="let similar of m.similar!.results.slice(0, 10)"
                                        type="button"
                                        (click)="openMovie(similar)"
                                        class="w-28 shrink-0 text-left cursor-pointer"
                                    >
                                        <img
                                            *ngIf="tmdb.getImageUrl(similar.poster_path, 'w342') as posterUrl; else noSimilarPoster"
                                            [src]="posterUrl"
                                            [alt]="similar.title"
                                            class="aspect-[2/3] w-28 rounded-lg object-cover shadow-card transition hover:scale-105"
                                        />
                                        <ng-template 
                                            #noSimilarPoster
                                        >
                                            <div 
                                                class="flex aspect-[2/3] w-28 items-center justify-center rounded-lg bg-surface text-xs text-white"
                                            >
                                                No image
                                            </div>
                                        </ng-template>
                                        <p 
                                            class="mt-1.5 truncate text-xs font-semibold text-white"
                                        >
                                            {{ similar.title }}
                                        </p>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </ng-container>
                </div>
            </div>
        </div>
    `,
})

export class MovieDetailsOverlayComponent implements OnInit, OnDestroy {
    private modal = inject(MovieDetailsService);
    tmdb = inject(TmdbService);
    private favorites = inject(FavoritesService);
    private firestore = inject(FirestoreService);
    auth = inject(AuthService);
    
    private cdr = inject(ChangeDetectorRef);

    rendered = false;
    visible = false;

    movie: MovieDetails | null = null;
    loading = true;
    errorMessage: string | null = null;
    isFavorite = false;
    favoriteLoading = false;

    private touchStartY = 0;
    private closeTimeout?: ReturnType<typeof setTimeout>;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.modal.state$
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ open, movieId }) => {
                if (open && movieId) {
                    this.handleOpen(movieId);
                } else if (!open) {
                    this.handleClose();
                }
            });
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
    
    private handleOpen(movieId: number): void {
        clearTimeout(this.closeTimeout);

        this.rendered = true;
        this.visible = true;          // set both immediately
        this.loading = true;
        this.errorMessage = null;
        this.movie = null;

        this.cdr.detectChanges();     // force UI update

        this.tmdb.getMovieDetails(movieId).subscribe({
            next: (details) => {
                this.movie = details;
                this.loading = false;

                // if (this.auth.currentUser) {
                //     this.favorites.isFavorite(movieId).then((val) => {
                //         this.isFavorite = val;
                //         this.cdr.detectChanges();
                //     });
                // }
                if(this.auth.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(
                    (user => {
                        if(!user) {
                            this.isFavorite = false;
                            return;
                        }
                        if (!this.movie) return;
                        this.favorites.isFavorite(this.movie.id).then((value) => {
                            this.isFavorite = value;
                            this.cdr.detectChanges();
                        });
                    })
                ))

                this.cdr.detectChanges();
            },
            error: (error) => {
                this.errorMessage = 'Could not load this movie. It may not exist.';
                this.loading = false;
                this.cdr.detectChanges();
            },
        });
    }

    private handleClose(): void {
        this.visible = false;
        this.cdr.detectChanges();

        clearTimeout(this.closeTimeout);
        this.closeTimeout = setTimeout(() => {
            this.rendered = false;
            this.movie = null;
            this.errorMessage = null;
            this.isFavorite = false;
            this.cdr.detectChanges();
        }, EXIT_ANIMATION_MS);
    }

    close(): void {
        this.modal.close();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.close();
    }

    onTouchStart(event: TouchEvent): void {
        this.touchStartY = event.touches[0].clientY;
    }

    onTouchEnd(event: TouchEvent): void {
        const delta = event.changedTouches[0].clientY - this.touchStartY;
        if (delta > 80) this.close(); // swipe down to dismiss
    }

    /** Clicking a "Similar Movie" swaps the modal's content in place, rather than stacking modals. */
    openMovie(movie: Movie): void {
        this.modal.open(movie.id);
    }

    get backdropUrl(): string | null {
        return this.movie ? this.tmdb.getImageUrl(this.movie.backdrop_path, 'w1280') : null;
    }

    get posterUrl(): string | null {
        return this.movie ? this.tmdb.getImageUrl(this.movie.poster_path, 'w500') : null;
    }

    get releaseYear(): string {
        return this.movie?.release_date ? this.movie.release_date.split('-')[0] : '';
    }

    get cast() {
        return this.movie?.credits?.cast?.slice(0, 12) ?? [];
    }

    get director(): string {
        const directors = this.movie?.credits?.crew?.filter((c) => c.job === 'Director') ?? [];
        return directors.map((d) => d.name).join(', ');
    }

    get studioNames(): string {
        return this.movie?.production_companies?.map((c) => c.name).join(', ') ?? '';
    }

    formatRuntime(minutes: number): string {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    }

    // async toggleFavorite(): Promise<void> {
    //     if (!this.movie) return;
    //     this.favoriteLoading = true;
    //     try {
    //         this.isFavorite = await this.favorites.toggle(this.movie);
    //     } finally {
    //         this.favoriteLoading = false;
    //     }
    // }
    async toggleFavorite(): Promise<void> {
        if (!this.movie || this.favoriteLoading) return;

        const previousState = this.isFavorite;

        // Change UI immediately
        this.isFavorite = !this.isFavorite;
        this.favoriteLoading = true;
        this.cdr.detectChanges();

        try {
            await this.favorites.toggle(this.movie);
        } catch (error) {
            // Restore previous state if Firebase fails
            this.isFavorite = previousState;
            this.cdr.detectChanges();
        } finally {
            this.favoriteLoading = false;
            this.cdr.detectChanges();
        }
    }
}