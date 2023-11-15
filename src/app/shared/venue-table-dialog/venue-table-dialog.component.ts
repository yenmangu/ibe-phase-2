import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venue } from '../data/interfaces/venue-data';

@Component({
	selector: 'app-venue-table-dialog',
	templateUrl: './venue-table-dialog.component.html',
	styleUrls: ['./venue-table-dialog.component.scss']
})
export class VenueTableDialogComponent {
	isEdit: boolean;
	applyMagentaGreyTheme = true;
	newVenue: Venue;

	existingName: string = '';
	venueName: string = '';
	venueNumber: string | null;
	venueAdded: string;
	lastPlay: { $: { date: string } }[];
	venueObject: Venue = {
		key: '',
		value: {
			$: {
				type: 'loc',
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
		public dialogRef: MatDialogRef<VenueTableDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.newVenue = { ...this.venueObject };
	}
	ngOnInit(): void {
		let existingRowData;
		if (this.data && this.data.existingRowData) {
			this.isEdit = true;
			existingRowData = { ...this.data.existingRowData };
			this.existingName = existingRowData.value.name || '';
			this.venueName = existingRowData.value.name || '';
			this.venueNumber = existingRowData.value.$?.n;
			this.venueAdded = existingRowData.value.$?.adddate || '';
			this.lastPlay = [...existingRowData.value.lastplay];
		}
		if (this.data && this.data.searchTerm) {
			this.venueName = this.data.searchTerm;
			console.log(
				'@Input() searchTerm in dialog component at OnInit: ',
				this.venueName
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
			this.venueAdded = new Date().toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit'
			});
		}

		console.log(this.lastPlay.length);
	}

	onSave(): void {
		const finalData = { isNew: true || false, existingName: null, data: undefined };
		if (this.isEdit) {
			finalData.isNew = false;
			const updatedVenue: Venue = { ...this.data.existingRowData };
			console.log('updatedVenue: ', updatedVenue);
			console.log('this.venueName: ', this.venueName);

			updatedVenue.value.name = this.venueName;
			updatedVenue.value.$.n = this.venueNumber;
			updatedVenue.value.$.adddate = this.venueAdded;
			updatedVenue.value.lastplay = this.lastPlay;
			finalData.existingName = this.existingName;
			finalData.data = updatedVenue;
		} else {
			finalData.isNew = true;
			const newVenue = { ...this.venueObject };
			newVenue.value.name = [this.venueName];
			finalData.data = newVenue;
		}
		this.dialogRef.close(finalData);
	}
	onCancel() {
		this.dialogRef.close();
	}
}
