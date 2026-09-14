import { 
    ChangeDetectorRef,
    Component, 
    inject, 
    Input, 
    OnChanges, 
    OnDestroy, 
    SimpleChanges 
} from "@angular/core";

import { Movie } from "../../models/movie.model";
import { TmdbService } from "../../../core/services/tmdb.service";
import { CommonModule } from "@angular/common";


@Component({
    selector: 'app-hero-banner',
    standalone: true,
    imports: [CommonModule],
    template: `
        <section
            *ngIf = "currentMovie as m"
            class="items-center relative flex h-[80vh] min-h-[420px] w-full overflow-hidden sm:h-[100vh] rounded-xl"
        >
            <img
                *ngIf="backdropUrl"
                [src]="backdropUrl"
                [alt]="m.title"
                class="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500"
                [attr.data-id]="m.id"
            />
            
            <div
                class = "absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
            ></div>
            
            <div
                class = "absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent"
            ></div>
            
            <div
                class="absolute bottom-0 left-0 z-10 w-full px-5 pb-1 sm:px-8 sm:pb-1 lg:px-10 lg:pb-1"
            >
                <div
                    class="w-full rounded-xl bg-black/3 px-5 py-5 backdrop-blur-md sm:px-6 sm:py-6"
                >
                    <h1
                        class = "text-lg font-black text-white drop-shadow-lg sm:text-xl"
                    >
                        {{m.title}}
                    </h1>

                    <div
                        class = "mt-1.5 flex flex-wrap items-center gap-3 text-lg text-gray-200 sm:text-base"
                    >
                        <span
                            *ngIf = "m.vote_average" class="flex items-center gap-1 font-bold text-[#f5c518]"
                        >
                            ★ {{ m.vote_average | number: '1.1-1' }}
                        </span>

                        <span
                            *ngIf = "releaseYear"
                            class = "font-bold text-white text-sm"
                        >
                            {{releaseYear}}
                        </span>
                    </div>

                    <p
                        class="mt-0.5 line-clamp-2 w-full text-[13px] text-gray-200 sm:text-[13px]"
                    >
                        {{m.overview}}
                    </p>

                    <div
                        class = "mt-1.5 flex flex-wrap gap-3"
                    >
                        <a
                            class = "flex items-center gap-2 rounded-lg bg-[#e50914] px-6 py-3 text-white transition hover:bg-primary-dark font-bold cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch Now
                        </a>

                        <a
                            class = "flex items-center gap-2 rounded-lg bg-black/70 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/40 cursor-pointer"
                        >
                            More Info
                        </a>
                    </div>
                </div>
            </div>
            
            <div
                class = "absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20"
            >
                <div
                    class="h-full bg-[#e50914] transition-all duration-100 ease-linear"
                    [style.width.%]="progress"
                ></div>
            </div>
        </section>
    `,
})

export class HeroBannerComponent implements OnChanges, OnDestroy {
    @Input() movies: Movie[] = [];
    @Input() interval = 6000;

    private tmdb = inject(TmdbService);
    private cdr = inject(ChangeDetectorRef)

    currentIndex = 0;
    progress = 0;

    private timer: ReturnType<typeof setTimeout> | null = null;
    private progressTimer: ReturnType<typeof setInterval> | null = null;

    get currentMovie(): Movie | null {
        return this.movies.length
            ? this.movies[this.currentIndex]
            : null;
    }

    get backdropUrl(): string | null {
        return this.currentMovie
            ? this.tmdb.getImageUrl(
                this.currentMovie.backdrop_path,
                'w1280'
            )
            : null;
    }

    get releaseYear(): string {
        return this.currentMovie?.release_date
            ? this.currentMovie.release_date.split('-')[0]
            : '';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes['movies']) {
            return;
        }
        this.clearTimers();

        this.currentIndex = 0;
        this.progress = 0;
        if (this.movies.length > 1) {
            this.startAutoPlay();
        }
    }

    ngOnDestroy(): void {
        this.clearTimers();
    }

    private startAutoPlay(): void {
        this.clearTimers();

        this.progress = 0;

        const progressStep = 100 / (this.interval / 50);

        this.progressTimer = setInterval(() => {
            this.progress = Math.min(
                this.progress + progressStep,
                100
            );
            this.cdr.detectChanges();
        }, 50);

        this.timer = setTimeout(() => {
            this.nextMovie();
            this.cdr.detectChanges();
        }, this.interval);
    }

    private nextMovie(): void {
        if (this.movies.length <= 1) {
            return;
        }

        this.currentIndex = (this.currentIndex + 1) % this.movies.length;

        this.progress = 0;

        this.cdr.detectChanges();

        this.startAutoPlay();
    }

    private clearTimers(): void {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        if (this.progressTimer !== null) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
    }
}