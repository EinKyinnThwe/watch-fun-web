import { 
    CommonModule 
} from "@angular/common";

import { 
    Component 
} from "@angular/core";


@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
        <footer
            class = "border-t border-border bg-[#0a0a0b] px-4 py-8 pt-10 text-sm text-[#71717a] sm:px-6 lg:px-10"
        >
            <div
                class = "flex mx-auto max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row"
            >
                <p
                    class = "text-sm text-white font-bold"
                >
                    Watch<span class = "text-[#e50914] text-sm">Fun</span>
                </p>
                
                <p
                    class = "text-[#a1a1aa]"
                >
                    Movies data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
                </p>
                <p
                    class = "font-bold text-[#a1a1aa]"
                >&copy; {{year}} Watch<span class = "text-[#e50914]">Fun</span></p>
            </div>
        </footer>
    `,
})

export class FooterComponent {
    readonly year = new Date().getFullYear();
}