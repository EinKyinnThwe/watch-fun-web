import { 
    Injectable 
} from "@angular/core";

import { 
    BehaviorSubject 
} from "rxjs";


@Injectable({providedIn: 'root'})
export class SpotLightSearchService {
    private readonly openSubject = new BehaviorSubject<boolean>(false);
    readonly isOpen$ = this.openSubject.asObservable();
    
    open(): void {
        console.log('✅ Service open() called');
        this.openSubject.next(true);
    }
    
    close(): void {
        this.openSubject.next(false);
    }
    
    toggle(): void {
        this.openSubject.next(!this.openSubject.value);
    }
}