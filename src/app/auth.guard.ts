import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './services/user.service'; // Adjust path if needed
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.userService.getUser().pipe(
            map(user => {
                if (user) {
                    return true;
                } else {
                    this.router.navigate(['/client-login']);
                    return false;
                }
            }),
            catchError(() => {
                this.router.navigate(['/client-login']);
                return of(false);
            })
        );
    }
}
