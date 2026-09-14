import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { 
    Router,
    RouterLink, 
    RouterLinkActive 
} from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { SpotLightSearchService } from "../../../core/services/spotlight-search.service";


@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLinkActive, RouterLink],
    template: `
        <header 
             class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/95 backdrop-blur border-b border-[#27272a]"
        >
            <nav 
                class = "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10"
            >
                <a 
                    routerLink = "/home"
                    class = "text-xl font-black tracking-wide text-white "
                >
                    Watch<span class = "text-[#e50914]">Fun</span>
                </a>
                
                <ul
                    class = "hidden items-center gap-6 text-sm font-semibold text-gray-300 md:flex"
                >
                    <li>
                        <a
                            routerLink = "/home"
                            routerLinkActive = "text-white"
                            [routerLinkActiveOptions] = "{exact: true}"
                            class = "hover:text-white transition-colors"
                        >
                            Home
                        </a>
                    </li>
                    
                    <li>
                        <a
                            routerLink = "/my-list"
                            routerLinkActive = "text-white"
                            class = "hover:text-white transition-colors"
                        >
                            My List
                        </a>
                    </li>
                    
                    <li>
                        <button
                            type = "button"
                            (click) = "spotlight.open()"
                            class = "flex items-center gap-1.5 hover:text-white cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4"
                            >
                                <circle cx="11" cy="11" r="8"/>
                                <path stroke-linecap="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            Search
                        </button>
                    </li>
                </ul>
                
                <div
                    class = "hidden items-center gap-3 md:flex"
                >
                    <ng-container
                        *ngIf = "auth.currentUser$ | async as user; else authLinks"
                    >
                        <a
                            routerLink = "/profile"
                            class = "flex h-9 w-9 items-center justify-center rounded-full bg-[#e50914] font-bold text-white hover:bg-[#f40612] transition-colors"
                        >
                            {{ initial(user.displayName || user.email) }}
                        </a>
                        
                        <button
                            type = "button"
                            (click) = "logout()"
                            class = "rounded-lg border border-[#27272a] px-3.5 py-1.5 text-sm font-medium text-[#a1a1aa] hover:border-[#e50914] hover:text-white transition-all"
                        >
                            Log Out
                        </button>
                    </ng-container>
                    
                    <ng-template #authLinks>
                        <a
                            routerLink = "/login"
                            class = "text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors"
                        >
                            Login
                        </a>
                        
                        <a
                            routerLink = "/register"
                            class = "rounded-lg bg-[#e50914] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f40612] transition-colors"
                        >
                            Sign Up
                        </a>
                    </ng-template>
                </div>
                
                <div
                    class = "flex items-center gap-1 md:hidden"
                >
                    <button
                        type = "button"
                        (click) = "spotlight.open()"
                        class = "flex h-10 w-10 items-center justify-center text-white cursor-pointer"
                        aria-label = "Search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
                        </svg>
                    </button>
                </div>
                
                <button
                    type = "button"
                    (click) = "mobileMenuOpen = !mobileMenuOpen"
                    aria-label = "Toggle menu"
                    class = "flex h-10 w-10 items-center justify-center text-white md:hidden cursor-pointer"
                >
                    <svg
                        xmlns = "http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"
                    >
                        <path *ngIf="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                        <path *ngIf="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </nav>
            
            <div
                    *ngIf="mobileMenuOpen"
                    class="border-t border-[#27272a] bg-[#0a0a0b] md:hidden"
                >
                    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                        <ul class="flex flex-col gap-1 text-sm font-medium text-[#a1a1aa]">

                            <li>
                                <a
                                    routerLink="/home"
                                    routerLinkActive="text-white bg-[#18181b]"
                                    [routerLinkActiveOptions]="{ exact: true }"
                                    (click)="mobileMenuOpen = false"
                                    class="block rounded-lg px-3 py-3 transition-colors hover:bg-[#18181b] hover:text-white"
                                >
                                    Home
                                </a>
                            </li>

                            <li *ngIf="auth.currentUser">
                                <a
                                    routerLink="/my-list"
                                    routerLinkActive="text-white bg-[#18181b]"
                                    (click)="mobileMenuOpen = false"
                                    class="block rounded-lg px-3 py-3 transition-colors hover:bg-[#18181b] hover:text-white"
                                >
                                    My List
                                </a>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    (click)="mobileMenuOpen = false; spotlight.open()"
                                    class="block w-full rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#18181b] hover:text-white cursor-pointer"
                                >
                                    Search
                                </button>
                            </li>

                            <li *ngIf="auth.currentUser">
                                <a
                                    routerLink="/profile"
                                    routerLinkActive="text-white bg-[#18181b]"
                                    (click)="mobileMenuOpen = false"
                                    class="block rounded-lg px-3 py-3 transition-colors hover:bg-[#18181b] hover:text-white"
                                >
                                    Profile
                                </a>
                            </li>

                            <li
                                *ngIf="auth.currentUser"
                                class="pt-2"
                            >
                                <button
                                    type="button"
                                    (click)="logout()"
                                    class="w-full rounded-lg border border-[#27272a] px-3 py-3 text-left transition-all hover:border-[#e50914] hover:text-white cursor-pointer"
                                >
                                    Log Out
                                </button>
                            </li>

                        </ul>
                    </div>
                </div>
        </header>
    `,
})

export class NavbarComponent {
    auth = inject(AuthService);
    spotlight = inject(SpotLightSearchService);
    private router = inject(Router);
    
    mobileMenuOpen = false;

    initial(name: string | null): string {
        return (name || '?').charAt(0).toUpperCase();
    }

    async logout(): Promise<void> {
        await this.auth.logout();
        this.mobileMenuOpen = false;
        this.router.navigate(['/']);
    }
}