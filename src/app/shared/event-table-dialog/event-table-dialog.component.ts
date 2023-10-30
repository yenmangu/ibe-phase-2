import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventInterface } from '../data/interfaces/event-data';
@Component({
  selector: 'app-event-table-dialog',
  templateUrl: './event-table-dialog.component.html',
  styleUrls: ['./event-table-dialog.component.scss']
})
export class EventTableDialogComponent implements OnInit {
	@Input() existingRowData: EventInterface;
	isEdit: boolean;
	applyMagentaGreyTheme = true;
	newEvent: EventInterface;

	eventName: string | undefined;
	eventNumber: string | null;
	eventAdded: string;
	lastPlay: { $: { date: string } }[];

	eventObject: EventInterface = {
		key: '',
		value: {
			$: {
				type: 'event',
				n: null,
				adddate: new Date().toLocaleDateString('en-GB', {
					day: '2-digit',
					month: '2-digit',
					year: '2-digit'
				})
			},
			name: [],
			lastplay: [
				{
					$: {
						date: new Date().toLocaleDateString('en-GB', {
							day: '2-digit',
							month: '2-digit',
							year: '2-digit'
						})
					}
				}
			]
		}
	};
	constructor(
		public dialogRef: MatDialogRef<EventTableDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.newEvent = { ...this.eventObject };
	}

	ngOnInit(): void {
		if (this.data && this.data.existingRowData) {
			this.existingRowData = this.data.existingRowData;
			this.isEdit = true;
			if (this.data && this.data.existingRowData) {
				this.eventName = this.existingRowData.value.name[0] || '';
				this.eventNumber = this.existingRowData.value.$?.n;
				this.eventAdded = this.existingRowData.value.$?.adddate || '';
				this.lastPlay = [...this.existingRowData.value.lastplay];
				console.log('existing row data: ', this.existingRowData);
			}
		}
		if (this.data && this.data.searchTerm) {
			this.eventName = this.data.searchTerm;
			console.log(
				'@Input() searchTerm in dialog component at OnInit: ',
				this.eventName
			);
		}
		if (!this.isEdit) {
			this.lastPlay = [
				{
					$: {
						date: new Date().toLocaleDateString('en-GB', {
							day: '2-digit',
							month: '2-digit',
							year: '2-digit'
						})
					}
				}
			];
			this.eventAdded = new Date().toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit'
			});
		}

		console.log(this.lastPlay.length);
	}

	addlastPlay() {
		const newlastPlay = {
			$: {
				date: ''
			}
		};
		this.lastPlay.push(newlastPlay);
	}

	shouldShow(i): boolean {
		const length = this.lastPlay.length;
		if (length === 1) {
			return true;
		}
		if (length > 1 && i === length - 1) {
			return true;
		}
		if (!this.isEdit && length > 1 && i === length - 1) {
			return true;
		}
		return false;
	}

	removeLastPlay() {
		const index = this.lastPlay.length - 1;
		if (index >= 0) {
			this.lastPlay.splice(index, 1);
		}
		console.error('Cannot remove index 0');
	}

	onSave(): void {
		const finalData = { isNew: true || false, data: undefined };
		if (this.isEdit) {
			finalData.isNew = false;
			const updatedEvent: EventInterface = { ...this.data.existingRowData };
			updatedEvent.value.name = [this.eventName];
			updatedEvent.value.$.n = this.eventNumber;
			updatedEvent.value.$.adddate = this.eventAdded;
			updatedEvent.value.lastplay = this.lastPlay;
			finalData.data = updatedEvent;
			console.log('event to be updated with: ', JSON.stringify(finalData, null, 2));
			// this.dialogRef.close(updatedEvent);
		} else {
			finalData.isNew = true;
			const newEvent = { ...this.eventObject };
			console.log('shallow copy of event: ', JSON.stringify(newEvent, null, 2));
			newEvent.value.name = [this.eventName];
			finalData.data = newEvent;
			console.log('new event created: ', JSON.stringify(finalData, null, 2));
			// this.dialogRef.close();
		}
		this.dialogRef.close(finalData);
	}

	onCancel() {
		this.dialogRef.close();
	}
}
