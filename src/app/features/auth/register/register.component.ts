import { CommonModule } from "@angular/common";
import { 
    Component, 
    inject 
} from "@angular/core";

import { 
    AbstractControl, 
    FormBuilder, 
    ReactiveFormsModule, 
    ValidationErrors, 
    Validators
} from "@angular/forms";

import { 
    Router, 
    RouterLink 
} from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";


function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
        <div class = "min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#0a0a0b] px-4 py-12">
            <div class = "w-full max-w-[400px]">
                <h1 class = "text-3xl font-black tracking-tight text-white mb-10">
                    Watch<span class = "text-[#e50914]">Fun</span>
                </h1>
                
                <h2 class = "text-2xl text-white font-bold">Create Account</h2>
                <p class = "mt-5 text-[#a1a1aa] text-[15px]">Unlimited movies, TV shows, and more!</p>
                
                <form [formGroup] = "form" (ngSubmit) = "onSubmit()" class = "mt-8 space-y-5">
                    <div>
                        <label class = "block text-[#a1a1aa] text-sm font-medium mb-2">Full Name</label>
                        <input
                            type = "text"
                            formControlName = "name"
                            class = "w-full h-12 px-4 rounded-xl bg-[#141416] border border-[#27272a] text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/30 transition-all"
                            placeholder = "John Doe"
                        />
                        <p class = "text-xs text-[#e50914] mt-1.5"
                            *ngIf = "form.controls.name.touched && form.controls.name.invalid"
                        >
                            Name is required!
                        </p>
                    </div>
                    
                    <div>
                        <label class = "block text-[#a1a1aa] text-sm mb-2">Email</label>
                        <input 
                            type = "email"
                            formControlName = "email"
                            placeholder = "johndoe@gmail.com"
                            class = "w-full h-12 px-4 rounded-xl bg-[#141416] border border-[#27272a] text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/30 transition-all"
                        />
                        <p
                            class = "text-xs text-[#e50914] mt-1.5"
                            *ngIf = "form.controls.email.touched && form.controls.email.invalid"
                        >
                            Enter a valid email!
                        </p>
                    </div>
                    
                    <div>
                        <label class = "block text-sm text-[#a1a1aa] mb-2">Password</label>
                        <input 
                            type = "password"
                            formControlName = "password"
                            placeholder = "••••••••"
                            class = "w-full h-12 px-4 rounded-xl bg-[#141416] border border-[#27272a] text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/30 transition-all"
                        />
                        <p
                            class = "text-xs text-[#e50914] mt-1.5"
                            *ngIf = "form.controls.password.touched && form.controls.password.invalid"
                        >
                            Password at least 6 characters!
                        </p>
                    </div>
                    
                    <div>
                        <label class = "block text-sm text-[#a1a1aa] mb-2">Confirm Password</label>
                        <input 
                            type = "password"
                            formControlName = "confirmPassword"
                            placeholder = "••••••••"
                            class = "w-full h-12 px-4 rounded-xl bg-[#141416] border border-[#27272a] text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/30 transition-all"
                        />
                        <p
                            class = "text-xs text-[#e50914] mt-1.5"
                            *ngIf="form.errors?.['passwordsMismatch'] && form.controls.confirmPassword.touched"
                        >
                            Passwords do not match!
                        </p>
                    </div>
                    
                    <p
                        class = "text-sm text-[#e50914] text-center"
                        *ngIf = "errorMessage"
                    >
                        {{errorMessage}}
                    </p>
                    
                    <button
                        type = "submit"
                        [disabled] = "loading"
                        class="w-full h-12 rounded-xl bg-[#e50914] text-white font-semibold hover:bg-[#f40612] active:scale-[0.98] disabled:opacity-50 transition-all duration-300"
                    >
                        {{ loading ? 'Creating Account...' : 'Create Account' }}
                    </button>
                </form>
                
                <div class = "my-8 flex items-center gap-4">
                    <div class="h-px flex-1 bg-[#27272a]"></div>
                    <span class = "text-xs text-[#71717a] uppercase tracking-wider">OR</span>
                    <div class="h-px flex-1 bg-[#27272a]"></div>
                </div>
                
                <button
                    type = "button"
                    (click) = "registerWithGoogle()"
                    [disabled] = "loading"
                    class = "w-full h-12 rounded-xl border border-[#27272a] bg-[#141416] flex items-center justify-center gap-3 text-white font-medium hover:bg-[#1c1c1f] hover:border-[#3f3f46] disabled:opacity-50 transition-all"
                >
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign Up with Google
                </button>
                
                <p
                    class = "mt-10 text-[#71717a] text-center text-sm"
                >
                    Already have an account?
                    <a
                        routerLink = "/login"
                        class = "text-[#e50914] font-semibold hover:underline ml-1"
                    >
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    `,
})

export class RegisterComponent {
    private formBuilder = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);
    loading = false;
    errorMessage: string | null = null;
    
    //Form
    form = this.formBuilder.nonNullable.group(
        {
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]],
        },
        {validators: passwordsMatchValidator},
    );
    
    // On submit
    async onSubmit(): Promise<void> {
        if(this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.errorMessage = null;
        this.loading = true;
        try {
            const { name, email, password } = this.form.getRawValue();
            await this.auth.register(email, password, name);
            this.router.navigateByUrl('/login');
        } catch (error) {
            this.errorMessage = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }
    
    // Register with google
    async registerWithGoogle(): Promise<void> {
        this.errorMessage = null;
        this.loading = true;
        try {
            await this.auth.loginWithGoogle();
            this.router.navigateByUrl('/home');
        } catch (error) {
            this.errorMessage = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }
}