import { Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { SharedDataService } from './shared-data.service';
import { DialogModel } from '../models/dialog_model';
import { dialogData } from '../data/dialogs';
import { DialogConfig } from '@angular/cdk/dialog';

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

	openDialog(dialogName: string): MatDialogRef<any> | undefined {
		const dialogConfig = this.findDialog(dialogName);
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

	closeDialog(): void {
		if (this.dialogRef) {
			this.dialogRef.close();
			this.dialogRef = null;
		}
	}
}
