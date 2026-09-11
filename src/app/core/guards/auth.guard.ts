import { inject } from "@angular/core";
import { type CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map, take } from "rxjs";


export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    
    return auth.currentUser$.pipe(
        take(1),
        map((user) => {
            if(user) return true;
            return router.createUrlTree(['/login'], {
                queryParams: { returnUrl: state.url },
            });
        }),
    );
};