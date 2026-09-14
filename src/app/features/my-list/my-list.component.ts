import { 
    CommonModule 
} from "@angular/common";

import { 
    Component, 
    inject,
    Input
} from "@angular/core";

import { 
    TmdbService 
} from "../../core/services/tmdb.service";

import { 
    FavoritesService 
} from "../../core/services/favorites.service";

import { 
    EmptyStateComponent 
} from "../../shared/components/empty-state/empty-state.component";
import { MovieDetailsService } from "../../core/services/movie-details.service";


@Component({
    selector: 'app-my-list',
    standalone: true,
    imports: [CommonModule, EmptyStateComponent],
    template: `
        <div
            class = "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10"
        >
            <div
                class = "flex items-center mb-6 justify-between mt-17"
            >
                <h1
                    class = "text-3xl text-white font-bold"
                >
                    My List
                </h1>
                
                <button
                    *ngIf = "(favorites$ | async)?.length"
                    type = "button"
                    (click) = "clearAll()"
                    class = "text-[#e50914] text-sm font-semibold hover:text-white cursor-pointer"
                >
                    Clear All
                </button>
            </div>
            
            <ng-container
                *ngIf = "favorites$ | async as favorites"
            >
                <app-empty-state
                    *ngIf = "favorites.length === 0"
                    icon = "🎬"
                    title = "Your List is Empty!"
                    subTitile = "Movies you favorites will show up here!"
                />
                
                <div 
                    class="grid grid-cols-3 gap-7 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
                >
                    <a
                        *ngFor="let item of favorites"
                        (click)="openDetails($any(item)['movieId'])"
                        class="group block"
                    >
                        <div 
                            class="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface shadow-md transition-transform group-hover:scale-105"
                        >
                        <img
                            *ngIf="tmdb.getImageUrl($any(item['poster_path']), 'w342') as posterUrl; else noPoster"
                            [src]="posterUrl"
                            [alt]="$any(item).movieTitle"
                            class="h-full w-full object-cover"
                        />
                        <ng-template #noPoster>
                            <div 
                                class="flex h-full w-full items-center justify-center bg-surface-elevated text-xs text-muted"
                            >
                                No image
                            </div>
                        </ng-template>
                        </div>
                        <p 
                            class="mt-2 truncate text-sm font-semibold text-white"
                        >
                            {{ $any(item).movieTitle }}
                        </p>
                    </a>
                </div>
            </ng-container>
        </div>
    `,
})

export class MyListComponent {
    tmdb = inject(TmdbService);
    private modal = inject(MovieDetailsService);
    
    private favoriteService = inject(FavoritesService);
    favorites$ = this.favoriteService.favorites$;
    
    async clearAll(): Promise<void> {
        await this.favoriteService.clearAll();
    }
    
    openDetails(movieId: number): void {
        this.modal.open(movieId);
    }
}