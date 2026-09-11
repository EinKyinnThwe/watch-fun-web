import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { SpotLightSearchComponent } from '../shared/components/spotlight-search/spotlight-search.component';
import { MovieDetailsOverlayComponent } from '../shared/components/movie-details-overlay/movie-details-overlay.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, SpotLightSearchComponent, MovieDetailsOverlayComponent],
    template: `
    <div class="flex min-h-screen flex-col bg-background">
      <app-navbar></app-navbar>

      <main class="flex-1">
        <router-outlet />
      </main>
    </div>
    <app-spotlight-search></app-spotlight-search>
    <app-movie-details-overlay></app-movie-details-overlay>
  `,
})
export class MainLayoutComponent { }