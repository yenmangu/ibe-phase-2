import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from '../data/interfaces/player-data';

@Component({
	selector: 'app-player-table-dialog',
	templateUrl: './player-table-dialog.component.html',
	styleUrls: ['./player-table-dialog.component.scss']
})
export class PlayerTableDialogComponent implements OnInit {
	@Input() existingRowData: Player;

	applyMagentaGreyTheme = true;
	newPlayer: Player;
	ebuChecked: boolean = false;
	bboChecked: boolean = false;
	playerObject: Player = {
		$: {
			type: 'player',
			n: '',
			adddate: new Date().toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit'
			})
		},
		name: [],
		email: [],
		telephone: [],
		id: []
	};

	playerName: string = '';
	playerEmail: string = '';
	playerTelephone: string = '';
	ebuId: string;
	bboId: string;
	constructor(
		public dialogRef: MatDialogRef<PlayerTableDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.newPlayer = { ...this.playerObject };
	}

	ngOnInit(): void {
		if (this.existingRowData) {
			this.playerName = this.existingRowData.name[0] || '';
			this.playerEmail = this.existingRowData.email[0] || '';
			this.playerTelephone = this.existingRowData.telephone[0] || '';
			if (this.existingRowData.id){
				
			}
		}
	}

	onSave(): void {
		const newPlayer = { ...this.newPlayer };
		newPlayer.name = [this.playerName];
		newPlayer.email = [this.playerEmail];
		newPlayer.telephone = [this.playerTelephone];
		newPlayer.id = [];
		newPlayer.$.type = this.newPlayer.$.type;
		newPlayer.$.n = this.newPlayer.$.n;
		newPlayer.$.adddate = this.newPlayer.$.adddate;
		if (this.ebuChecked && this.ebuId) {
			newPlayer.id.push({
				$: {
					type: 'EBU',
					code: this.ebuId
				}
			});
		}
		if (this.bboChecked && this.bboId) {
			newPlayer.id.push({
				$: {
					type: 'BBO',
					code: this.bboId
				}
			});
		}

		console.log('NewPLayer created: ', JSON.stringify(newPlayer, null, 2));
		this.dialogRef.close(newPlayer);
	}
	onCancel(): void {
		this.dialogRef.close();
	}
}
