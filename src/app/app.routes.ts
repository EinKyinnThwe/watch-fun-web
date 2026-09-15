import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Auth pages – NO navbar
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    },

    // Pages that NEED the navbar
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'home',
                loadComponent: () =>
                    import('./features/home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'my-list',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./features/my-list/my-list.component').then(m => m.MyListComponent),
            },
            {
                path: 'profile',
                loadComponent: () => 
                    import('./features/profile/profile.component').then(m => m.ProfileComponent),
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
        ],
    },

    // Fallback
    { path: '**', redirectTo: 'login' },
];