import { Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { PlayerTableDialogComponent } from '../player-table-dialog/player-table-dialog.component';
import { SharedDataService } from './shared-data.service';
import { DialogModel } from '../models/dialog_model';
import { dialogData } from '../data/dialogs';
import { TeamTableDialogComponent } from '../team-table-dialog/team-table-dialog.component';
import { EventTableDialogComponent } from '../event-table-dialog/event-table-dialog.component';
import { VenueTableDialogComponent } from '../venue-table-dialog/venue-table-dialog.component';
import { AdvancedOptionsDialogComponent } from 'src/app/admin/games/database-landing/advanced-options-dialog/advanced-options-dialog.component';
@Injectable({
	providedIn: 'root'
})
export class DialogService implements OnInit {
	public dialogs: DialogModel[] = dialogData;
	public gameCode: string;
	constructor(
		private dialog: MatDialog,
		private sharedDataService: SharedDataService,
		private dialogRef: MatDialogRef<any> | null = null
	) {}

	ngOnInit(): void {
		this.sharedDataService.gameCode$.subscribe(gameCodeObservable => {
			console.log('Dialog Service Game Code Observable: ', gameCodeObservable);
		});
		console.log('Game Code: ', this.gameCode);
	}

	findDialog(name: string): DialogModel | undefined {
		return this.dialogs.find(dialog => dialog.dialogName === name);
	}

	findAndManipulateDialog(name: string): DialogModel | undefined {
		const dialogConfig = this.dialogs.find(dialog => dialog.dialogName === name);

		if (dialogConfig) {
			this.sharedDataService.gameCode$.subscribe(gamecode => {
				dialogConfig.data.gameCode = gamecode;
				console.log('Dialog Config GameCode: ', gamecode);
			});
			return dialogConfig;
		}
		return undefined;
	}

	openDialog(
		dialogName: string,
		error?: string,
		email?: string,
		dirKey?: string,
		values?: any,
		component?: any,
		data?: any
	): MatDialogRef<any> | undefined {
		const dialogConfig = this.findDialog(dialogName);
		let matDialogConfig: MatDialogConfig | undefined;
		if (dialogConfig) {
			matDialogConfig = {
				width: dialogConfig.width,
				data: { ...dialogConfig.data }
			};

			if (error) {
				dialogConfig.data.error = error;
			}
			if (email) {
				dialogConfig.data.email = email;
			}
			if (dirKey) {
				dialogConfig.data.dirKey = dirKey;
			}
		}
		if (matDialogConfig) {
			this.dialogRef = this.dialog.open(DialogComponent, matDialogConfig);
			return this.dialogRef;
		}
		return undefined;
	}

	openDialogManipulated(dialogName: string): MatDialogRef<any> | undefined {
		this.sharedDataService.gameCode$.subscribe(gamecode => {
			this.gameCode = gamecode;
			console.log('openDialog service game code: ', this.gameCode);
		});
		const dialogConfig = this.findAndManipulateDialog(dialogName);
		let matDialogConfig: MatDialogConfig | undefined;
		if (dialogConfig) {
			matDialogConfig = {
				width: dialogConfig.width,
				data: dialogConfig.data
			};
		}
		if (matDialogConfig) {
			this.dialogRef = this.dialog.open(DialogComponent, matDialogConfig);
			return this.dialogRef;
		}
		return undefined;
	}

	// openTableEditDialog(dialogName: string, data: any): MatDialogRef<any> | undefined {
	// 	const dialogConfig= this.dialogs.find(dialog => dialog.dialogName === dialogName)
	// 	if (dialogConfig){
	// 		dialogConfig.data
	// 	}
	// }

	openTableEditDialog(
		type: string,
		data?: any,
		searchTerm?: string
	): MatDialogRef<any> | undefined {
		// console.log('data passed from component: ', data);
		const matDialogConfig: MatDialogConfig = {
			width: '400px',
			data: {
				existingRowData: data,
				type: type ? type : undefined,
				searchTerm: searchTerm && searchTerm !== undefined ? searchTerm : undefined,

			}
		};
		console.log('dialog service config: ', matDialogConfig);
		let dialogToOpen: any;
		switch (type) {
			case 'player':
				dialogToOpen = PlayerTableDialogComponent;
				break;
			case 'team':
				dialogToOpen = TeamTableDialogComponent;
				break;
			case 'event':
				dialogToOpen = EventTableDialogComponent;
				break;
			case 'venue':
				dialogToOpen = VenueTableDialogComponent;
				break;
			default:
				console.log('No "type" provided so no dialog opened');
				break;
		}
		this.dialogRef = this.dialog.open(dialogToOpen, matDialogConfig);
		return this.dialogRef;
	}

	openDatabaseOptionsDialog(data): MatDialogRef<any> | undefined {
		const matDialogConfig: MatDialogConfig = {
			width: '700px'
		};
		this.dialogRef = this.dialog.open(
			AdvancedOptionsDialogComponent,
			matDialogConfig
		);
		return this.dialogRef;
	}

	closeDialog(): void {
		if (this.dialogRef) {
			this.dialogRef.close();
			this.dialogRef = null;
		}
	}
}
