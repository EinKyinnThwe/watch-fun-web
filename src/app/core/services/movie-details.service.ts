import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MovieDetailsService {
    private stateSubject = new BehaviorSubject<{ open: boolean; movieId: number | null }>({
        open: false,
        movieId: null,
    });

    readonly state$ = this.stateSubject.asObservable();

    open(movieId: number): void {
        this.stateSubject.next({ open: true, movieId });
    }

    close(): void {
        this.stateSubject.next({ open: false, movieId: null });
    }
}