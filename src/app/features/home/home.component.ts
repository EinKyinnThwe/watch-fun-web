import { 
    ChangeDetectorRef,
    Component, 
    inject, 
    OnInit 
} from "@angular/core";

import { HeroBannerComponent } from "../../shared/components/hero-banner/hero-banner.component";
import { CommonModule } from "@angular/common";
import { TmdbService } from "../../core/services/tmdb.service";
import { Movie } from "../../shared/models/movie.model";
import { forkJoin } from "rxjs";

import { MovieRowComponent } from "../../shared/components/movie-row/movie-row.component";


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, HeroBannerComponent, MovieRowComponent],
    template: `
        <app-hero-banner *ngIf="!heroLoading && trending.length" [movies]="trending.slice(0, 5)" />
        
        <div
            class="py-6"
        >
            <app-movie-row title = "Trending Movies" [movies] = "trending" [loading] = "loading"/>
            <app-movie-row title = "Upcoming Movies" [movies] = "upcoming" [loading] = "loading"/>
            <app-movie-row title = "Popular Show" [movies] = "popular" [loading] = "loading"/>
            <app-movie-row title = "Top Rated" [movies] = "topRated" [loading] = "loading"/>
        </div>
    `,
})

export class HomeComponent implements OnInit {
    private tmdb = inject(TmdbService);
    private cdr = inject(ChangeDetectorRef);

    trending: Movie[] = [];
    popular: Movie[] = [];
    topRated: Movie[] = [];
    upcoming: Movie[] = [];

    heroLoading = true;
    loading = true;

    ngOnInit(): void {
        this.loadAll();
    }

    private loadAll(): void {
        this.heroLoading = true;
        this.loading = true;

        forkJoin({
            trending: this.tmdb.getTrending('day'),
            popular: this.tmdb.getPopular(),
            topRated: this.tmdb.getTopRated(),
            upcoming: this.tmdb.getUpcoming(),
        }).subscribe({
            next: ({ trending, popular, topRated, upcoming }) => {
                this.trending = trending.results ?? [];
                this.popular = popular.results ?? [];
                this.topRated = topRated.results ?? [];
                this.upcoming = upcoming.results ?? [];

                this.heroLoading = false;
                this.loading = false;

                // Force UI update after navigation
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Home load error:', err);
                this.heroLoading = false;
                this.loading = false;
                this.cdr.detectChanges();
            },
        });
    }
}