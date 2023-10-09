import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from '../data/interfaces/player-data';

@Component({
	selector: 'app-player-table-dialog',
	templateUrl: './player-table-dialog.component.html',
	styleUrls: ['./player-table-dialog.component.scss']
})
export class PlayerTableDialogComponent implements OnInit, AfterViewInit {
	@Input() existingRowData: Player;
	isEdit: boolean;
	applyMagentaGreyTheme = true;
	newPlayer: Player;
	ebuChecked: boolean = false;
	bboChecked: boolean = false;
	playerName: string;
	playerEmail: string;
	playerTelephone: string;
	playerNumber: string | null;
	ebuId: string;
	bboId: string;
	dateAdded: string;
	lastPlay: string[];

	playerObject: Player = {
		$: {
			type: 'player',
			n: null,
			adddate: new Date().toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit'
			})
		},
		name: []
	};

	constructor(
		public dialogRef: MatDialogRef<PlayerTableDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.newPlayer = { ...this.playerObject };
	}

	ngOnInit(): void {
		let existingRowData;
		console.log('player-table-dialog OnInit');
		if (this.data && this.data.existingRowData) {
			this.isEdit = true;
			existingRowData = { ...this.data.existingRowData };
			console.log('testing shallow copy', existingRowData);
			this.playerNumber = existingRowData.$?.n;
			this.playerName = existingRowData.name[0] || '';
			this.playerEmail = existingRowData?.email || '';
			this.playerTelephone = existingRowData?.telephone || '';
			this.lastPlay = existingRowData?.lastplay[0].date || '';
			this.dateAdded = existingRowData.$?.adddate || '';

			if (existingRowData.id) {
				this.ebuChecked = this.isEbuChecked(existingRowData.id);
				this.bboChecked = this.isBboChecked(existingRowData.id);
				this.ebuId = this.getEbuId(existingRowData.id);
				this.bboId = this.getBboId(existingRowData.id);
			}
		}

		if (this.data && this.data.searchTerm) {
			this.playerName = this.data.searchTerm;
		}
		if (!this.isEdit) {
			this.dateAdded = new Date().toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit'
			});
		}
		// this.searchTerm = this.data.searchTerm ? this.data.searchTerm : undefined;
	}

	ngAfterViewInit(): void {}

	private isEbuChecked(idData: any[]): boolean {
		return idData.some(id => id.$.type === 'EBU');
	}

	private isBboChecked(idData: any[]): boolean {
		return idData.some(id => id.$.type === 'BBO');
	}

	private getEbuId(idData: any[]): string | undefined {
		const ebuIdObj = idData.find(id => id.$.type === 'EBU');
		return ebuIdObj ? ebuIdObj.$.code : undefined;
	}

	private getBboId(idData: any[]): string | undefined {
		const bboIdObj = idData.find(id => id.$.type === 'BBO');
		return bboIdObj ? bboIdObj.$.code : undefined;
	}

	onSave(): void {
		const finalData = { isNew: true || false, data: undefined };
		if (this.isEdit) {
			finalData.isNew = false;
			const updatedPlayer = { ...this.data.existingRowData };
			updatedPlayer.name = [this.playerName];
			updatedPlayer.email = [this.playerEmail];
			updatedPlayer.telephone = [this.playerTelephone];
			console.log('seeing how the data looks: ', updatedPlayer);
			if (this.ebuChecked && this.ebuId) {
				updatedPlayer.id = [];
				updatedPlayer.id.push({
					$: {
						type: 'EBU',
						code: this.ebuId
					}
				});
			}
			if (this.bboChecked && this.bboId) {
				updatedPlayer.id.push({
					$: {
						type: 'BBO',
						code: this.bboId
					}
				});
			}
			finalData.data = updatedPlayer;
			console.log('Updated player with: ', finalData);
			this.dialogRef.close(finalData);
		} else {
			console.log('player name: ', this.playerName);
			finalData.isNew = true;
			const newPlayer = { ...this.playerObject };
			console.log(JSON.stringify(newPlayer, null, 2));
			newPlayer.$.n = this.playerNumber;
			newPlayer.name = [this.playerName];
			if (this.playerEmail) {
				newPlayer.email = [this.playerEmail];
			}
			if (this.playerTelephone) {
				newPlayer.telephone = [this.playerTelephone];
			}
			if (this.ebuChecked && this.ebuId) {
				newPlayer.id = [];
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
			finalData.data = newPlayer;
			console.log('new player created: ', finalData);

			this.dialogRef.close(finalData);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}