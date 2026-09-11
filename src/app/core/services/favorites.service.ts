import { 
    inject,
    Injectable 
} from "@angular/core";

import { 
    AuthService 
} from "./auth.service";

import { 
    FavoriteMovie,
    FirestoreService 
} from "./firestore.service";
import { 
    Observable, 
    switchMap 
} from "rxjs";

import { of } from "rxjs";
import { Movie } from "../../shared/models/movie.model";


@Injectable ({providedIn: 'root'})
export class FavoritesService {
    private auth = inject(AuthService);
    private firestore = inject(FirestoreService);
    
    get favorites$(): Observable<FavoriteMovie[]> {
        return this.auth.currentUser$.pipe(
            switchMap((user) => (user ? this.firestore.getFavorites$(user.uid) : of([]))),
        );
    }
    
    async toggle(movie: Movie): Promise<boolean> {
        const user = this.auth.currentUser;
        if(!user) throw new Error('Must be sign in a favorite movies!');
        return this.firestore.toggleFavorites(user.uid, movie);
    }
    
    async isFavorite(movieId: number): Promise<boolean> {
        const user = this.auth.currentUser;
        if(!user) return false;
        return this.firestore.isFavorite(user.uid, movieId);
    }
    
    async clearAll(): Promise<void> {
        const user = this.auth.currentUser;
        if(!user) return;
        await this.firestore.clearFavorites(user.uid);
    }
}