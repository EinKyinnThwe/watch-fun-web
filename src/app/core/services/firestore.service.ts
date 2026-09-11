import {
    inject,
    Injectable
} from "@angular/core";

import {
    UserProfile
} from "@angular/fire/auth";

import {
    collection,
    collectionData,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "@angular/fire/firestore"

import {
    Observable,
    of,
} from "rxjs";
import { Movie } from "../../shared/models/movie.model";
import { error } from "console";

export interface FavoriteMovie {
    [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
    private firestore = inject(Firestore);

    async getUserProfile$(uid: string, fields: Partial<UserProfile>): Promise<void> {
        const ref = doc(this.firestore, 'users', uid);
        await setDoc(
            ref,
            {
                ...fields,
                updatedAt: serverTimestamp()
            },
            { merge: true }
        );
    }

    async updateProfileFields(uid: string, fields: Partial<UserProfile>): Promise<void> {
        const ref = doc(this.firestore, 'users', uid);
        await setDoc(
            ref,
            {
                ...fields,
                updatedAt: serverTimestamp(),
            },
            { merge: true },
        );
    }

    //Favorite Movie
    getFavorites$(uid: string): Observable<FavoriteMovie[]> {
        const favoriteRef = collection(this.firestore, 'users', uid, 'favorites');
        const favoriteQuery = query(favoriteRef, orderBy('addedAt', 'desc'));

        return new Observable<FavoriteMovie[]>((subscriber) => {
            const unsubscribe = onSnapshot(
                favoriteQuery,
                (snapshot) => {
                    const data = snapshot.docs.map((d) => ({
                        id: d.id,
                        ...d.data(),
                    })) as FavoriteMovie[];
                    subscriber.next(data);
                },
                (err) => subscriber.error(err)
            );

            return () => unsubscribe();
        });
    }

    async addFavorite(uid: string, movie: Movie): Promise<void> {
        const ref = doc(this.firestore, 'users', uid, 'favorites', String(movie.id));
        await setDoc(
            ref,
            {
                movieId: movie.id,
                movieTitle: movie.title || movie.name || '',
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                vote_average: movie.vote_average ?? null,
                addedAt: serverTimestamp(),
            },
            { merge: true },
        );
    }

    async removeFavorite(uid: string, movieId: number): Promise<void> {
        const ref = doc(this.firestore, 'users', uid, 'favorites', String(movieId));
        await deleteDoc(
            ref,
        );
    }

    async isFavorite(uid: string, movieId: number): Promise<boolean> {
        const ref = doc(this.firestore, 'users', uid, 'favorites', String(movieId));
        const snap = await getDoc(ref);
        return snap.exists();
    }

    async toggleFavorites(uid: string, movie: Movie): Promise<boolean> {
        const alreadyFavorite = await this.isFavorite(uid, movie.id);
        if (alreadyFavorite) {
            await this.removeFavorite(uid, movie.id);
            return false;
        }
        await this.addFavorite(uid, movie);
        return true;
    }

    async clearFavorites(uid: string): Promise<void> {
        const favoriteRef = collection(this.firestore, 'users', uid, 'favorites');
        const snap = await getDocs(favoriteRef);
        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    }
}