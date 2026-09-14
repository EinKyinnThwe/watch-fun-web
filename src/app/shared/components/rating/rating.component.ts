import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-rating',
    standalone: true,
    imports: [CommonModule],
    template: `
        <span 
            class="inline-flex items-center gap-1 font-semibold text-rating" 
            [class]="sizeClass"
        >
            ★ {{ value | number: '1.1-1' }}
        </span>
  `,
})
export class RatingComponent {
    @Input({ required: true }) value = 0;
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    get sizeClass(): string {
        return { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[this.size];
    }
}
