import {
    CommonModule
} from "@angular/common";

import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from "@angular/core";

import { Movie } from "../../models/movie.model";
import { TmdbService } from "../../../core/services/tmdb.service";
import { AuthService } from "../../../core/services/auth.service";
import { FavoritesService } from "../../../core/services/favorites.service";

import {
    Subject,
    takeUntil
} from "rxjs";
import { MovieDetailsService } from "../../../core/services/movie-details.service";


@Component({
    selector: 'app-movie-card',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            (click)="openDetails()"
            role="button"
            tabindex="0"
            class="group w-[160px] min-w-[160px] shrink-0 cursor-pointer text-left sm:w-[180px] sm:min-w-[180px] md:w-[200px] md:min-w-[200px] lg:w-[220px] lg:min-w-[220px]"
        >
        <div
            class="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface shadow-md transition-transform duration-200 ease-out group-hover:scale-105 group-hover:shadow-xl"
        >
            <img
            *ngIf="posterUrl; else noPoster"
            [src]="posterUrl"
            [alt]="movie.title || movie.name"
            loading="lazy"
            class="h-full w-full object-cover"
            />
            <ng-template #noPoster>
            <div class="flex h-full w-full items-center justify-center bg-surface-elevated text-muted text-xs">
                No image
            </div>
            </ng-template>

            <!-- hover overlay with quick actions (desktop) -->
            <div
            class="absolute inset-0 hidden items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-2 sm:group-hover:flex"
            >
            <button
                type="button"
                (click)="onFavoriteClick($event)"
                class="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-[#f40612] transition"
                [attr.aria-label]="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                [style.fill]="isFavorite ? '#f40612' : 'none'"
                [style.stroke]="isFavorite ? '#f40612' : '#f40612'"
                stroke-width="2"
                class="h-4 w-4"
                >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
                </svg>
            </button>
            </div>

            <!-- rating badge -->
            <div
                *ngIf="movie.vote_average"
                class="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-[#f5c518]"
            >
            <span>★</span>
            <span>{{ movie.vote_average | number: '1.1-1' }}</span>
            </div>

            <!-- mobile-visible favorite button (touch friendly, always shown) -->
            <button
            type="button"
            (click)="onFavoriteClick($event)"
            class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-[#f40612] sm:hidden"
            [attr.aria-label]="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                [style.fill]="isFavorite ? '#f40612' : 'none'"
                [style.stroke]="isFavorite ? '#f40612' : '#f40612'"
                stroke-width="2"
                class="h-3.5 w-3.5"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
            </button>
        </div>

        <p class="mt-2 truncate text-sm font-semibold text-white">
            {{ movie.title || movie.name }}
        </p>
        <p class="text-xs text-[#a1a1aa]">{{ releaseYear }}</p>
        </div>
    `,
})

export class MovieCardComponent implements OnChanges, OnDestroy, OnInit {

    @Input({ required: true }) movie!: Movie;
    @Output() favoriteToggled = new EventEmitter<{ movie: Movie; isFavorite: boolean }>();

    private tmdb = inject(TmdbService);
    private auth = inject(AuthService);
    private favorites = inject(FavoritesService);
    private destroy$ = new Subject<void>();
    private modal = inject(MovieDetailsService);

    isFavorite = false;
    private loadingFavorite = false;

    get posterUrl(): string | null {
        return this.tmdb.getImageUrl(this.movie.poster_path, 'w342');
    }

    get releaseYear(): string {
        return this.movie.release_date ? this.movie.release_date.split('-')[0] : '';
    }
    
    openDetails(): void {
        this.modal.open(this.movie.id);
    }

    ngOnInit(): void {
        this.loadFavoriteState();
        this.auth.currentUser$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => this.loadFavoriteState());
    }

    // constructor() {
    //     this.auth.currentUser$
    //         .pipe(takeUntil(this.destroy$))
    //         .subscribe(() => {
    //             this.loadFavoriteState();
    //         }
    //         );
    // }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['movie'] && this.movie) {
            this.loadFavoriteState();
        }
    }


    private async loadFavoriteState(): Promise<void> {
        if (!this.auth.currentUser) {
            this.isFavorite = false;
            return;
        }
        try {
            this.isFavorite = await this.favorites.isFavorite(this.movie.id)
        } catch (error) {
            console.error("Fail to load Favorite state!", error);
            this.isFavorite = false;
        }
    }

    async onFavoriteClick(event: Event): Promise<void> {
        event.preventDefault();
        event.stopPropagation();
        if (!this.auth.currentUser || this.loadingFavorite) return;
        this.loadingFavorite = true;
        const previous = this.isFavorite;
        this.isFavorite = !previous;
        try {
            const newState = await this.favorites.toggle(this.movie);
            this.isFavorite = newState;
            this.favoriteToggled.emit({ movie: this.movie, isFavorite: newState });
        } catch (error) {
            console.log("Toggle favorites failed!", error);
            this.isFavorite = previous;
        } finally {
            this.loadingFavorite = false;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}