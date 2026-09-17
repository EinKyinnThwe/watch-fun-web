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
            *ngIf="currentMovie as m"
            class="relative flex h-[70vh] min-h-[380px] w-full overflow-hidden rounded-2xl sm:h-[85vh]"
        >
            <!-- Backdrop -->
            <img
                *ngIf="backdropUrl"
                [src]="backdropUrl"
                [alt]="m.title"
                class="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
                [attr.data-id]="m.id"
            />

            <!-- Dark gradients (matching the photo) -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"></div>

            <!-- Content -->
            <div class="absolute bottom-0 left-0 z-10 w-full px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
                <div class="max-w-2xl">
                    <!-- HD badge -->
                    <div class="mb-3 inline-flex items-center rounded bg-[#e50914] px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">
                        HD
                    </div>

                    <!-- Title -->
                    <h1 class="text-2xl font-black leading-tight text-white drop-shadow-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        {{ m.title }}
                    </h1>

                    <!-- Meta -->
                    <div class="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-200 sm:text-base">
                        <span *ngIf="m.vote_average" class="flex items-center gap-1 font-bold text-[#f5c518]">
                            ★ {{ m.vote_average | number:'1.1-1' }}
                        </span>
                        <span *ngIf="releaseYear" class="font-semibold text-white/90">
                            {{ releaseYear }}
                        </span>
                    </div>

                    <!-- Overview -->
                    <p class="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-gray-200/90 sm:text-[15px]">
                        {{ m.overview }}
                    </p>

                    <!-- Buttons -->
                    <div class="mt-5 flex flex-wrap gap-3">
                        <a class="flex items-center gap-2 rounded-md bg-[#e50914] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#f40612] cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch Now
                        </a>

                        <a class="flex items-center gap-2 rounded-md bg-white/20 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/30 cursor-pointer">
                            More Info
                        </a>
                    </div>
                </div>
            </div>

            <!-- Progress bar (at the very bottom) -->
            <div class="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20">
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
    private cdr = inject(ChangeDetectorRef);

    currentIndex = 0;
    progress = 0;

    private timer: ReturnType<typeof setTimeout> | null = null;
    private progressTimer: ReturnType<typeof setInterval> | null = null;

    get currentMovie(): Movie | null {
        return this.movies.length ? this.movies[this.currentIndex] : null;
    }

    get backdropUrl(): string | null {
        return this.currentMovie
            ? this.tmdb.getImageUrl(this.currentMovie.backdrop_path, 'w1280')
            : null;
    }

    get releaseYear(): string {
        return this.currentMovie?.release_date
            ? this.currentMovie.release_date.split('-')[0]
            : '';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes['movies']) return;
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

    goTo(index: number): void {
        if (index === this.currentIndex) return;
        this.clearTimers();
        this.currentIndex = index;
        this.progress = 0;
        this.cdr.detectChanges();
        this.startAutoPlay();
    }

    private startAutoPlay(): void {
        this.clearTimers();
        this.progress = 0;

        const progressStep = 100 / (this.interval / 50);

        this.progressTimer = setInterval(() => {
            this.progress = Math.min(this.progress + progressStep, 100);
            this.cdr.detectChanges();
        }, 50);

        this.timer = setTimeout(() => {
            this.nextMovie();
            this.cdr.detectChanges();
        }, this.interval);
    }

    private nextMovie(): void {
        if (this.movies.length <= 1) return;
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