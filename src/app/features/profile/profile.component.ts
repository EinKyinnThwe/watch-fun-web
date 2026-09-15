import { 
    CommonModule 
} from "@angular/common";

import { 
    Component, 
    inject
} from "@angular/core";

import { 
    AuthService 
} from "../../core/services/auth.service";

import { 
    FirestoreService 
} from "../../core/services/firestore.service";

import { 
    Router 
} from "@angular/router";

import { 
    map,
    Observable, 
    of, 
    switchMap
} from "rxjs";


@Component ({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            class = "mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-10"
        >
            <div
                class = "mt-17 flex flex-col items-center text-center"
            >
                <div
                    class = "flex h-24 w-24 items-center justify-center rounded-full bg-[#1c1c1f] text-white font-black text-3xl shadow-glow-[#141416] border border-[#b20710]"
                >
                    {{ initial((auth.currentUser$ | async)?.displayName || (auth.currentUser$ | async)?.email) }}
                </div>
                
                <h1
                    class = "text-white mt-2 font-bold text-2xl"
                >
                    {{ (auth.currentUser$ | async)?.displayName || 'Movie Fan' }}
                </h1>
                <div
                    class="mt-1 inline-flex items-center gap-2 rounded-full border border-[#27272a] bg-[#18181b] px-3 py-1.5 text-xs font-semibold text-[#d4d4d8]"
                >
                    <span class = "h-2 w-2 rounded-full bg-green-500"></span>
                    Active
                </div>
            </div>
            
            <div
                class = "gap-4"
            >
                <div
                    class = "glass-card rounded-xl p-2 text-center shadow-card"
                >
                    <p
                        class = "mt-1 font-bold text-white text-3xl"
                    >
                        {{ favoritesCount$ | async }}
                    </p>
                    
                    <p
                        class = "text-sm text-[#a1a1aa]"
                    >
                        Favorites
                    </p>
                    
                    <p
                        class = "text-xs text-[#a1a1aa] mt-1"
                    >
                        Saved to your list
                    </p>
                </div>
            </div>
            
            <div
                class = "rounded-2xl border border-[#3f3f46] bg-[#111113] p-6 transition hover:border-[#f40612] mt-2 mx-auto"
            >
                <div
                    class = "flex items-center justify-between mx-auto ml-7"
                >
                    <div>
                        <p
                            class = "text-white text-sm font-bold"
                        >
                            Account
                        </p>
                        
                        <p
                            class = "text-2xl font-black mt-2 text-white"
                        >
                            Free
                        </p>
                        
                        <p
                            class = "text-sm text-white mt-2"
                        >
                            Watch<span class = "text-[#e50914]">Fun</span> MemberShip
                        </p>
                    </div>
                    
                    <div
                        class = "flex bg-[#e50914]/30 w-12 h-12 rounded-xl text-[#e50914] items-center justify-center mr-7"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-width="2" 
                            class="h-6 w-6" 
                        > 
                            <path 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-.953M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" 
                            /> 
                        </svg>
                    </div>
                </div>
            </div>
            
            <div
                class = "bg-[#111113] rounded-2xl mt-6 overflow-hidden border border-[#3f3f46]"
            >
                <div
                    class = "border-b text-[#3f3f46] px-6 py-5 w-[90%] mx-auto"
                >
                    <h2
                        class = "text-lg font-bold text-white"
                    >
                        Account Information
                    </h2>
                    
                    <p
                        class = "text-[#a1a1aa] font-bold text-xs mt-1"
                    >
                        Your WatchFun Account Details
                    </p>
                </div>
                
                <div
                    class = "divide-y divide-[#3f3f46] w-[90%] items-center justify-center mx-auto"
                >
                    <div
                        class = "flex items-center justify-between px-6 py-4"
                    >
                        <div
                            class = "flex items-center gap-4"
                        >
                            <div
                                class = "flex bg-[#e50914]/30 text-[#e50914] h-10 w-10 rounded-lg items-center justify-center"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke-width="1.8" 
                                    stroke="currentColor" 
                                    class="h-5 w-5" 
                                > 
                                    <path 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round" 
                                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
                                    /> 
                                </svg>
                            </div>
                            
                            <div>
                                <p
                                    class = "text-[#a1a1aa] font-semibold font-xs"
                                >
                                    Display Name
                                </p>
                                
                                <p
                                    class = "mt-1 font-semibold text-white text-sm"
                                >
                                    {{ (auth.currentUser$ | async)?.displayName || 'Movie Fan' }}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div
                        class = "flex items-center justify-between px-6 py-4"
                    >
                        <div
                            class = "flex items-center gap-4"
                        >
                            <div
                                class = "flex bg-[#e50914]/30 text-[#e50914] h-10 w-10 rounded-lg items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.8"
                                    stroke="currentColor"
                                    class="h-5 w-5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 6.993V6.75"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p
                                    class = "text-[#a1a1aa] font-semibold font-xs"
                                >
                                    Email Address
                                </p>

                                <p
                                    class = "mt-1 font-semibold text-white text-sm"
                                >
                                    {{ (auth.currentUser$ | async)?.email}}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div
                        class = "flex items-center justify-between px-6 py-4"
                    >
                        <div
                            class = "flex items-center gap-4"
                        >
                            <div
                                class = "flex bg-[#e50914]/30 text-[#e50914] h-10 w-10 rounded-lg items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.8"
                                    stroke="currentColor"
                                    class="h-5 w-5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.333 9-6.03 9-11.623 0-1.31-.21-2.572-.598-3.75A11.96 11.96 0 0 1 12 2.714Z"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p
                                    class = "text-[#a1a1aa] font-semibold font-xs"
                                >
                                    Status
                                </p>

                                <p
                                    class = "mt-1 font-semibold text-white text-sm"
                                >
                                    Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div
                class = "mt-6"
            >
                <h2
                    class = "text-white text-lg mb-3 font-bold px-1"
                >
                    Quick Actions
                </h2>
                
                <div
                    class = "grid gap-3 sm:grid-cols-2"
                >
                    <button
                        type="button" 
                        (click)="router.navigate(['/my-list'])" 
                        class="group flex items-center justify-between rounded-xl border border-[#27272a] bg-[#111113] px-5 py-4 text-left transition hover:border-[#e50914]/50 hover:bg-[#151517]"
                    >
                        <div
                            class = "flex items-center gap-4"
                        >
                            <div
                                class = "flex h-10 w-10 items-center justify-center rounded-lg bg-[#e50914]/30 text-[#e50914]"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke-width="2" 
                                    stroke="currentColor" 
                                    class="h-5 w-5" 
                                > 
                                    <path 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round" 
                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" 
                                    /> 
                                </svg>
                            </div>
                            
                            <div> 
                                <p 
                                    class="font-semibold text-white"
                                > 
                                    My List 
                                </p> 
                                <p 
                                    class="text-xs text-[#a1a1aa]"
                                > 
                                    View your favorite movies 
                                </p> 
                            </div>
                        </div>
                        
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke-width="2" 
                            stroke="currentColor" 
                            class="h-5 w-5 text-[#52525b] transition group-hover:translate-x-1 group-hover:text-white" 
                        > 
                            <path 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                d="m8.25 4.5 7.5 7.5-7.5 7.5" 
                            /> 
                        </svg>
                    </button>
                    
                    <button
                        type="button"
                        (click)="router.navigate(['/home'])"
                        class="group flex items-center justify-between rounded-xl border border-[#27272a] bg-[#111113] px-5 py-4 text-left transition hover:border-[#e50914]/50 hover:bg-[#151517]"
                    >
                        <div
                            class = "flex items-center gap-4"
                        >
                            <div
                                class = "flex h-10 w-10 items-center justify-center rounded-lg bg-[#e50914]/30 text-[#e50914]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    class="h-5 w-5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="m2.25 12 8.954-8.954c.44-.44 1.152-.44 1.591 0L21.75 12M4.5 9.75V19.5a2.25 2.25 0 0 0 2.25 2.25h3v-6.75h4.5v6.75h3a2.25 2.25 0 0 0 2.25-2.25V9.75M8.25 21.75h7.5"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p
                                    class="font-semibold text-white"
                                >
                                    Browse Movies
                                </p>
                                <p
                                    class="text-xs text-[#a1a1aa]"
                                >
                                    Discover something to watch
                                </p>
                            </div>
                        </div>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="h-5 w-5 text-[#52525b] transition group-hover:translate-x-1 group-hover:text-white"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <button
                type = "button"
                (click) = "logout()"
                class = "mx-auto flex mt-7 w-[70%] rounded-lg border border-[#b20710] items-center justify-center py-3 font-bold text-[#e50914] hover:text-white text-xl cursor-pointer"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke-width="2" 
                    stroke="currentColor" 
                    class="h-5 w-5" 
                > 
                    <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3h-9m0 0 3-3m-3 3 3 3" 
                    /> 
                </svg>
                Logout
            </button>
            <p 
                class="mt-4 text-center text-xs text-[#a1a1aa]"
            > 
                "You can sign back in anytime to access your favorites."
            </p>
        </div>
    `,
})

export class ProfileComponent {
    auth = inject(AuthService);
    private firestore = inject(FirestoreService);
    router = inject(Router);
    
    favoritesCount$: Observable<number> = this.auth.currentUser$.pipe(
        switchMap((user => (user ? this.firestore.getFavorites$(user.uid) : of([])))),
        map((favorites) => favorites.length),
    );
    
    initial(name: string | null | undefined): string {
        return (name || '?').charAt(0).toUpperCase();
    }
    
    async logout(): Promise<void> {
        await this.auth.logout();
        this.router.navigate(['/']);
    }
}