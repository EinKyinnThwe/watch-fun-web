import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpotLightSearchComponent } from './shared/components/spotlight-search/spotlight-search.component';
import { MovieDetailsOverlayComponent } from './shared/components/movie-details-overlay/movie-details-overlay.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, SpotLightSearchComponent, MovieDetailsOverlayComponent],
    template: `
        <router-outlet />
        <app-spotlight-search></app-spotlight-search>
        <app-movie-details-overlay></app-movie-details-overlay>
    `,
})
export class App {
    protected readonly title = signal('watch-fun');
}