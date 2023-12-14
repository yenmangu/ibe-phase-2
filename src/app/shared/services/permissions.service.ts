import { Injectable, inject } from '@angular/core';
import {
	Router,
	ActivatedRoute,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	CanActivateFn,
	UrlTree
} from '@angular/router';
import { Observable, catchError, of, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IndexedDatabaseStatusService } from './indexed-database-status.service';

@Injectable({
	providedIn: 'root'
})
class PermissionsService {
	constructor(
		private router: Router,
		private authService: AuthService,
		private IDBStatus: IndexedDatabaseStatusService
	) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> {
		const url = state.url;

		// console.log(state);
		return this.authService.isAuthedSubject$.pipe(
			take(1),
			switchMap(isAuthed => {
				if (isAuthed) {
					console.log('isAuthed', isAuthed);
				}
				// console.log(state);
				// Add logic once user permissions implemented
				const hasPermissions = true;
				if (!isAuthed) {
					if (url !== '/home') {
						console.log('redirecting to home');
						this.router.navigate(['/home']);
					}
					return of(true);
				} else if (url === '/home') {
					this.router.navigate(['/admin']);
					console.log('home denied to authed. redirecting to /admin');
					this.IDBStatus.resetProgress();
					return of(false);
				} else {
					return of(true);
				}
			}),
			catchError(() => {
				return of(false);
			})
		);
	}
}

export const AuthGuard: CanActivateFn = (
	next: ActivatedRouteSnapshot,
	state: RouterStateSnapshot
): Observable<boolean> => {
	return inject(PermissionsService).canActivate(next, state);
};
