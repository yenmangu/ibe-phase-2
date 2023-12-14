import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, startWith, finalize, switchMap, of, from } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { GameActionsHttpService } from 'src/app/shared/services/game-actions-http.service';
import { CurrentGamesDatabaseServiceService } from '../../services/current-games-database-service.service';
import { SharedGameDataService } from '../../services/shared-game-data.service';
import { tag } from 'rxjs-spy/cjs/operators';
import { BboUploadComponent } from 'src/app/shared/bbo-upload/bbo-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { UsebioComponent } from 'src/app/shared/usebio/usebio.component';

@Component({
	selector: 'app-game-actions',
	templateUrl: './game-actions.component.html',
	styleUrls: ['./game-actions.component.scss']
})
export class GameActionsComponent implements OnInit, OnDestroy {
	@Output() uploadSuccess: EventEmitter<any> = new EventEmitter<any>();
	dateSelected: Date | null;
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	private destroy$ = new Subject<void>();

	lockValue: boolean = null;

	purgeSuccess: boolean = false;
	lockSuccess: boolean = false;
	finaliseSuccess: boolean = false;
	redateSuccess: boolean = false;
	simultaneousClicked: boolean = false;
	simultaneousSuccess: boolean = false;
	simultaneousButtonText: string = 'Save';
	mergeCleared: boolean = false;

	finalising: boolean = false;

	gameCode: string = '';
	dirKey: string = '';

	simultaneous: string = '';

	uploadFiles: any[] = [];
	constructor(
		private breakpointService: BreakpointService,
		private dialogService: DialogService,
		private gameActions: GameActionsHttpService,
		private currentGameData: CurrentGamesDatabaseServiceService,
		private sharedGameData: SharedGameDataService,
		private datePipe: DatePipe,
		private dialog: MatDialog
	) {}
	ngOnInit(): void {
		// this.breakpoint$.subscribe(() => this.breakpointChanged());
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
				// console.log(this.currentBreakpoint)
			});
		this.currentGameData.fetchLock().then(response => {
			console.log('fetch lock response: ', response);

			this.sharedGameData.GameAction$.pipe(tag('lock value')).subscribe(lock => {
				this.lockValue = lock;
			});
		});
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirKey = localStorage.getItem('DIR_KEY');
		console.log('lockValue: ', this.lockValue);
	}

	onFinalise() {
		this.finalising = true;
		this.finaliseSuccess = false;
		const data = {
			gameCode: this.gameCode,
			dirKey: this.dirKey
		};
		this.gameActions
			.finaliseGame(data)
			.pipe(
				startWith(true),
				finalize(() => {
					this.finalising = false;
				})
			)
			.subscribe(response => {
				if (response.success) {
					this.finaliseSuccess = true;
					this.finalising = false;
				}
			});
	}

	onLock() {
		const data: any = {};
		console.log('in onLock(): this.lockValue: ', this.lockValue);
		data.setLock = !this.lockValue;
		console.log('data in onLock: ', data);
		data.gameCode = this.gameCode;
		this.gameActions
			.lockGame(data)
			.pipe(
				switchMap(response => {
					console.log('initial response from lock: ', response);

					if (response.successVal === true) {
						console.log('writing lock to db');
						this.lockValue = !this.lockValue;

						return from(this.currentGameData.writeLock(this.lockValue));
					} else {
						this.lockSuccess = false;
						return of(false);
					}
				})
			)
			.subscribe(result => {
				console.log('lock result: ', result);

				if (result) {
					this.lockSuccess = true;
				}
			});
	}

	onMergeChange() {
		this.simultaneousSuccess = false;
		this.simultaneousButtonText = 'Save';
		this.simultaneousClicked = false;
		this.mergeCleared = false;
	}

	onBBO() {
		this.openBBODialog();
	}
	onImportUSEBIO() {
		this.openUSEBIODialog()
	}

	// uploadFilesInArray() {
	// 	if (this.uploadFiles.length > 0) {
	// 		this.gameActions
	// 			.bboToServer(this.uploadFiles, this.gameCode)
	// 			.subscribe(response => {
	// 				console.log(response.data);
	// 			});
	// 	}
	// }

	onBCL() {}

	onPurge() {
		this.dialogService
			.openDialog('PURGE')
			.afterClosed()
			.subscribe(result => {
				if (result === 'success') {
					console.log('success in purge click');
					// invoke purge api
					const data = { gameCode: this.gameCode };
					this.gameActions.purgeGame(data).subscribe(response => {
						this.purgeSuccess = response.successVal ? true : false;
						console.log(response);
					});
				}
			});
	}

	saveDate() {
		console.log(this.dateSelected);
		const formattedDate = this.datePipe.transform(
			this.dateSelected,
			'dd MMMM yyyy'
		);
		console.log(formattedDate);
		const data = {
			gameCode: this.gameCode,
			dirKey: this.dirKey,
			date: formattedDate
		};
		this.gameActions.redateGame(data).subscribe(response => {
			if (response.successVal) {
				console.log(response);
				this.redateSuccess = true;
			}
		});
	}

	onChange() {
		this.redateSuccess = false;
	}

	saveSimultaneous() {
		console.log(this.simultaneous);
		const data = {
			gameCode: this.gameCode,
			dirKey: this.dirKey,
			simultaneous: this.simultaneous
		};
		this.gameActions.setSimultaneous(data).subscribe(response => {
			console.log(response);

			if (response.successVal) {
				this.simultaneousSuccess = true;
				this.simultaneousClicked = true;
				this.simultaneousButtonText = 'Game Merged';
				if (this.simultaneous === '') {
					this.mergeCleared = true;
				}
			}
		});
	}

	private resetSuccess() {
		this.purgeSuccess = false;
		this.finaliseSuccess = false;
		this.lockSuccess = false;
		this.redateSuccess = false;
	}

	private openBBODialog() {
		const dialogRef = this.dialog.open(BboUploadComponent, {
			width: '500px',

			data: {
				title: 'Upload BBO Digest',
				message: 'Drag your BBO .html files here, or click to select',
				gameCode: this.gameCode
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log('Dialog Closed');
		});
	}

	private openUSEBIODialog(){
		const dialogRef = this.dialog.open(UsebioComponent,{
			width: '500px',
			data:{
				title: 'Import USEBIO Digest',
				message: 'Drag USEBIO .lin file here, or click to select',
				gameCode: this.gameCode
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log('Dialog Closed');

		})
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		this.resetSuccess();
	}
}
