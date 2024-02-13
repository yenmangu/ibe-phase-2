import { Component, OnInit } from '@angular/core';
import { AdminToolsService } from 'src/app/shared/services/admin-tools.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from 'src/app/shared/custom-snackbar/custom-snackbar.component';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { switchMap } from 'rxjs';

@Component({
	selector: 'app-admin-tools',
	templateUrl: './admin-tools.component.html',
	styleUrls: ['./admin-tools.component.scss']
})
export class AdminToolsComponent implements OnInit {
	gameCode: string = '';
	isSuperAdmin: boolean = false;
	currentBreakpoint: string = '';
	constructor(
		private adminToolsService: AdminToolsService,
		private breakpointService: BreakpointService,
		private userDetailsService: UserDetailsService,
		private snackbar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(breakpoint => {
			this.currentBreakpoint = breakpoint;
		});

		this.userDetailsService.gameCode$
			.pipe(
				switchMap(gamecode => {
					console.log('User details in admin-tools component: ', gamecode);
					this.gameCode = gamecode;
					return this.adminToolsService.verifyAdmin(this.gameCode);
				})
			)
			.subscribe(response => {
				if (response.authStatus) {
					this.isSuperAdmin = true;
				}
			});

		// this.userDetailsService.gameCode$.subscribe(gamecode => {
		// 	console.log('User details in admin-tools component: ', gamecode);
		// 	this.gameCode = gamecode;
		// });

		// this.adminToolsService.verifyAdmin(this.gameCode).subscribe(response => {
		// 	if (response.authStatus) {
		// 		this.isSuperAdmin = true;
		// 	}
		// });
	}

	onBatchConvert() {
		this.adminToolsService.batchConvertReq().subscribe({
			next: response => {
				console.log(response);
				this.snackbar.open('Success performing batch operation.', 'Dismiss');
			},
			error: error => {
				console.error(error);
				this.snackbar.openFromComponent(CustomSnackbarComponent, {
					data: { message: 'Error performing batch operation.', error: error }
				});
			}
		});
	}
}
