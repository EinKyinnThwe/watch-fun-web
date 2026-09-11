import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";


@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            class = "flex flex-column items-center gap-3 text-center py-20"
        >
            <div
                class = "text-4xl"
            >
                {{icon}}
            </div>
            <p
                class = "text-lg font-semibold text-white"
            >
                {{title}}
            </p>
            <p
                *ngIf = "subTitle"
                class = "max-w-sm text-sm text-white"
            >
                {{subTitle}}
            </p>
        </div>
    `,
})

export class EmptyStateComponent {
    @Input() icon = '🎬';
    @Input() title = "Nothing Here Yet!";
    @Input() subTitle = '';
}