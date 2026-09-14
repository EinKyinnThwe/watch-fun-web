import { 
    inject,
    Injectable
} from "@angular/core";

import {
    Auth,
    authState,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    User,
} from "@angular/fire/auth";

import {
    doc,
    Firestore,
    serverTimestamp,
    setDoc,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private auth = inject(Auth);
    private fireStore = inject(Firestore);
    
    readonly currentUser$: Observable<User | null> = authState(this.auth);
    
    get currentUser(): User | null {
        return this.auth.currentUser;
    }

    async login(email: string, password: string): Promise<User> {
        try {
            const credential = await signInWithEmailAndPassword(
                this.auth,
                email.trim(),
                password
            );
            await this.upsertUserProfile(credential.user);
            return credential.user;
        } catch (error) {
            throw new Error(this.mapAuthError(error));
        }
    }
    
    async register(email: string, password: string, displayName: string): Promise<User> {
        try {
            const credential = await createUserWithEmailAndPassword(
                this.auth,
                email.trim(),
                password
            );
            if (displayName) {
                await updateProfile(credential.user, { displayName });
            }
            await this.upsertUserProfile(credential.user, { displayName });
            return credential.user;
        } catch (error) {
            throw new Error(this.mapAuthError(error));
        }
    }
    
    // Login with Google
    async loginWithGoogle(): Promise<User> {
        try {
            const provider = new GoogleAuthProvider();
            const credential = await signInWithPopup(this.auth, provider);
            await this.upsertUserProfile(credential.user);
            return credential.user;
        } catch (error) {
            throw new Error(this.mapAuthError(error));
        }
    }
    
    // Logout
    async logout(): Promise<void> {
        await signOut(this.auth);
    }
    
    // Upsert User Profile
    private async upsertUserProfile(user: User, extra: Record<string, unknown> = {}): Promise<void> {
        const ref = doc(this.fireStore, 'users', user.uid);
        await setDoc (
            ref,
            {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || (extra['displayName'] as string) || '',
                photoUrl: user.photoURL || null,
                updatedAt: serverTimestamp(),
                ...extra,
            },
            { merge: true },
        )
    }
    
    // Error Handel
    private mapAuthError(error: unknown): string {
        const code = (error as { code?: string })?.code || '';
        switch (code) {
            case 'auth/email-already-in-use':
                return 'That email is already registered.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Incorrect email or password.';
            case 'auth/network-request-failed':
                return 'Network error. Check your connection and try again.';
            case 'auth/popup-closed-by-user':
                return 'Google sign-in was cancelled.';
            default:
                return (error as Error)?.message || 'Something went wrong. Please try again.';
        }
    }
}