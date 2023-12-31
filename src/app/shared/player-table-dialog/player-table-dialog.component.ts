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
	playerName: string='';
	playerEmail: string= '';
	playerTelephone: string = '';
	playerNumber: string | null = '';
	ebuId: string;
	bboId: string;
	dateAdded: string;
	lastPlay: string[];

	playerObject: Player = {
		key: '',
		value: {
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
		}
	};

	constructor(
		public dialogRef: MatDialogRef<PlayerTableDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.newPlayer = { ...this.playerObject };
	}

	ngOnInit(): void {
<<<<<<< HEAD
		let existingRowData;
		// console.log('player-table-dialog OnInit', existingRowData);
		// console.log('player-table-dialog OnInit', existingRowData);
		if (this.data && this.data.existingRowData) {
			this.isEdit = true;
			existingRowData = { ...this.data.existingRowData };
			console.log('testing shallow copy', existingRowData);
			this.playerNumber = existingRowData.value.$?.n;
			this.playerName = existingRowData.value.name || '';
			this.playerEmail = existingRowData?.value?.email || undefined;
			this.playerTelephone = existingRowData?.value?.telephone || undefined;
			this.dateAdded = existingRowData.value?.$?.adddate || '';
			if (existingRowData.lastplay) {
				this.lastPlay = existingRowData?.value?.lastplay[0]?.date || '';
			}
			this.playerNumber = existingRowData.value.$?.n;
			this.playerName = existingRowData.value.name || '';
			this.playerEmail = existingRowData?.value?.email || undefined;
			this.playerTelephone = existingRowData?.value?.telephone || undefined;
			this.dateAdded = existingRowData.value?.$?.adddate || '';
			if (existingRowData.lastplay) {
				this.lastPlay = existingRowData?.value?.lastplay[0]?.date || '';
			}

			if (existingRowData.value.id) {
				this.ebuChecked = this.isEbuChecked(existingRowData.value.id);
				this.bboChecked = this.isBboChecked(existingRowData.value.id);
				this.ebuId = this.getEbuId(existingRowData.value.id);
				this.bboId = this.getBboId(existingRowData.value.id);
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
<<<<<<< HEAD
		const finalData = { isNew: true || false, data: undefined };
		if (this.isEdit) {
			finalData.isNew = false;
			const updatedPlayer = { ...this.data.existingRowData };
			updatedPlayer.value.name = this.playerName;
			updatedPlayer.value.email = this.playerEmail;
			updatedPlayer.value.telephone = this.playerTelephone;
			console.log('seeing how the data looks: ', updatedPlayer);
			if (this.ebuChecked && this.ebuId) {
				updatedPlayer.value.id = [];
				updatedPlayer.value.id.push({
					$: {
						type: 'EBU',
						code: this.ebuId
					}
				});
			}
			if (this.bboChecked && this.bboId) {
				updatedPlayer.value.id.push({
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
			newPlayer.value.$.n = this.playerNumber;
			newPlayer.value.name = [this.playerName];
			if (this.playerEmail) {
				newPlayer.value.email = [this.playerEmail];
			}
			if (this.playerTelephone) {
				newPlayer.value.telephone = [this.playerTelephone];
			}
			if (this.ebuChecked && this.ebuId) {
				newPlayer.value.id = [];
				newPlayer.value.id.push({
					$: {
						type: 'EBU',
						code: this.ebuId
					}
				});
			}
			if (this.bboChecked && this.bboId) {
				newPlayer.value.id.push({
					$: {
						type: 'BBO',
						code: this.bboId
					}
				});
			}
			finalData.data = newPlayer;
			console.log('new player created: ', finalData);

			this.dialogRef.close(finalData);
=======
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
>>>>>>> d51187bb20589d052195242e0565b314d43f3471
		}

		console.log('NewPLayer created: ', JSON.stringify(newPlayer, null, 2));
		this.dialogRef.close(newPlayer);
	}
	onCancel(): void {
		this.dialogRef.close();
	}
}
