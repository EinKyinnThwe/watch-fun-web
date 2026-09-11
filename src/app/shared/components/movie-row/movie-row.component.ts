import { 
    CommonModule 
} from "@angular/common";

import { 
    Component, 
    Input
} from "@angular/core";

import { Movie } from "../../models/movie.model";
import { RouterLink } from "@angular/router";
import { MovieCardComponent } from "../movie-card/movie-card.component";


@Component({
    selector: 'app-movie-row',
    standalone: true,
    imports: [CommonModule, RouterLink, MovieCardComponent],
    template: `
        <section
            class = "mb-8 px-4 sm:px-6 lg:px-10"
        >
            <div
                class = "mb-3 flex items-center justify-between"
            >
                <h2
                    class = "text-lg font-bold text-white sm:text-xl"
                >
                    {{title}}
                </h2>
                
                <a
                    *ngIf = "seeAllLink"
                    [routerLink] = "seeAllLink"
                    class = "text-sm font-semibold text-[#e50914] hover:text-[#b20710]"
                >
                    See All 
                </a>
            </div>
            
            <div
                class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            >
                <ng-container
                    *ngIf = "!loading"
                >
                    <app-movie-card
                        *ngFor="let movie of movies"
                        [movie]="movie"
                    />
                    <p
                        *ngIf = "movies.length === 0"
                        class = "py-6 text-sm text-[#71717a]"
                    >
                        Nothing to show here yet!
                    </p>
                </ng-container>
            </div>
        </section>
    `,
})

export class MovieRowComponent {
    @Input({
        required: true
    }) title = '';
    
    @Input() movies: Movie[] = [];
    @Input() loading = false;
    @Input() seeAllLink: string | null = null;
    trackByMovieId(index: number, movie: Movie): number {
        return movie.id;
    }
}