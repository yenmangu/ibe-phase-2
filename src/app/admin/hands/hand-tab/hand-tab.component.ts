import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HandService } from '../services/hand.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
@Component({
	selector: 'app-hand-tab',
	templateUrl: './hand-tab.component.html',
	styleUrls: ['./hand-tab.component.scss']
})
export class HandTabComponent implements OnInit, OnChanges {
	currentHandPage: number = 1;
	currentHandData: string[] = [];
	currentCardsArray: string[] = [];
	gameArray: [] = [];
	gameCode: string = '';
	hidden: boolean = false;
	currentBreakpoint;
	totalPages: number;
	constructor(
		private handService: HandService,
		private handActionsHttp: HandActionsHttpService,
		private dialog: MatDialog,
		private snackbar: MatSnackBar,
		private breakpointService: BreakpointService
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(
			breakpoint => (this.currentBreakpoint = breakpoint)
		);
		this.handService.currentHandPage$.subscribe(async page => {
			console.log('page changed to: ', page);

			this.currentHandPage = page;
			await this.fetchHandData(page);
		});
		this.gameCode = localStorage.getItem('GAME_CODE');
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ('currentHandPage' in changes) {
			const newPageValue = changes.currentHandPage.currentValue;
			console.log('pageValue: ', newPageValue);

			this.fetchHandData(newPageValue);
		}
	}

	handleHandPageChange(page: number): void {
		this.currentHandPage = page;
		// this.fetchHandData();
	}

	async fetchHandData(pageValue) {
		try {
			const handData = await this.handService.processCurrentHand(pageValue);
			const cardArray = await this.handService.processFullHand(pageValue);
			if (handData) {
				this.currentHandData = handData;
			}
			if (cardArray) {
				this.currentCardsArray = cardArray;
				this.totalPages = this.currentCardsArray.length;
			}
			console.log('card array length: ', this.currentCardsArray.length);
			console.log('current hand data: ', this.currentHandData);
		} catch (error) {
			console.error('Error displaying handData: ', error);
			this.showError(error);
		}
	}

	showError(error) {}

	onUploadNew() {}
	onDownloadCurrent() {}
	onDeletCurrent() {
		const dialogRef = this.dialog.open(DeleteDialogComponent, { width: '360px' });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.handActionsHttp
					.deleteHandRecord({ gameCode: this.gameCode })
					.subscribe({
						next: response => {
							console.log(response);
							if (response.success === true) {
								this.snackbar.open(
									'Hand config deleted. Please refresh database to see the latest changes.',
									'Dismiss'
								);
							}
						}
					});
			}
		});
	}
	onHide() {
		this.hidden = this.hidden === true ? false : true;
		console.log('hidden? ', this.hidden);
	}
}
