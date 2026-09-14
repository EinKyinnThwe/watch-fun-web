import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-favorite-button',
    standalone: true,
    imports: [CommonModule],
    template: `
        <button
            type="button"
            (click)="toggled.emit()"
            [disabled]="loading"
            class="glass-card flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-white transition hover:border-primary/50 disabled:opacity-60 cursor-pointer"
            [class.text-primary]="isFavorite"
            [class.shadow-glow-primary]="isFavorite"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                [attr.fill]="isFavorite ? '#f40612' : 'none'"
                stroke="#f40612"
                stroke-width="2"
                class="h-6 w-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
            {{ isFavorite ? 'In My List' : 'Add to My List' }}
        </button>
    `,
})
export class FavoriteButtonComponent {
    @Input() isFavorite = false;
    @Input() loading = false;
    @Output() toggled = new EventEmitter<void>();
}
