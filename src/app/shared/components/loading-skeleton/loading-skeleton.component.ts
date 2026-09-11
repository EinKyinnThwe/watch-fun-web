import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Generic shimmer skeleton. `variant` controls the shape:
 *  - "card"   : poster-card sized placeholder (for movie rows)
 *  - "hero"   : full-width hero placeholder
 *  - "text"   : a single line of text
 *  - "detail" : movie-details page skeleton (backdrop + text block)
 */
@Component({
    selector: 'app-loading-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="variant === 'card'" class="w-[140px] shrink-0 sm:w-[160px]">
      <div class="aspect-[2/3] animate-pulse rounded-xl bg-surface"></div>
      <div class="mt-2 h-3 w-3/4 animate-pulse rounded bg-surface"></div>
      <div class="mt-1 h-3 w-1/3 animate-pulse rounded bg-surface"></div>
    </div>

    <div *ngIf="variant === 'hero'" class="h-[60vh] min-h-[420px] w-full animate-pulse bg-surface sm:h-[75vh]"></div>

    <div *ngIf="variant === 'text'" class="h-4 w-full animate-pulse rounded bg-surface"></div>

    <div *ngIf="variant === 'detail'" class="w-full">
      <div class="h-[40vh] w-full animate-pulse bg-surface sm:h-[55vh]"></div>
      <div class="mx-auto max-w-4xl space-y-3 px-4 py-8">
        <div class="h-6 w-1/2 animate-pulse rounded bg-surface"></div>
        <div class="h-4 w-full animate-pulse rounded bg-surface"></div>
        <div class="h-4 w-full animate-pulse rounded bg-surface"></div>
        <div class="h-4 w-2/3 animate-pulse rounded bg-surface"></div>
      </div>
    </div>
  `,
})
export class LoadingSkeletonComponent {
    @Input() variant: 'card' | 'hero' | 'text' | 'detail' = 'card';
}
