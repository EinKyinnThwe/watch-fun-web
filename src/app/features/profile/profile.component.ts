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
                    class = "text-white mt-4 font-bold text-2xl"
                >
                    {{ (auth.currentUser$ | async)?.displayName || 'Movie Fan' }}
                </h1>
                
                <p
                    class = "mt-2 text-[#a1a1aa] font-bold text-sm"
                >
                    {{ (auth.currentUser$ | async)?.email }}
                </p>
            </div>
            
            <div
                class = "mt-5 gap-4"
            >
                <div
                    class = "glass-card rounded-xl p-6 text-center shadow-card"
                >
                    <p
                        class = "mt-4 font-bold text-white text-3xl"
                    >
                        {{ favoritesCount$ | async }}
                    </p>
                    
                    <p
                        class = "text-sm text-[#a1a1aa]"
                    >
                        Favorites
                    </p>
                </div>
            </div>
            
            <button
                type = "button"
                (click) = "logout()"
                class = "mx-auto flex mt-7 w-[70%] rounded-lg border border-[#b20710] items-center justify-center py-3 font-bold text-[#e50914] hover:text-white text-xl cursor-pointer"
            >
                Logout
            </button>
        </div>
    `,
})

export class ProfileComponent {
    auth = inject(AuthService);
    private firestore = inject(FirestoreService);
    private router = inject(Router);
    
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