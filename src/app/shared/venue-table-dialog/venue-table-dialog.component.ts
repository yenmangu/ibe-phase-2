import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venue } from '../data/interfaces/venue-data';

@Component({
	selector: 'app-venue-table-dialog',
	templateUrl: './venue-table-dialog.component.html',
	styleUrls: ['./venue-table-dialog.component.scss']
})
export class VenueTableDialogComponent {
	@Input() existingRowData: Venue;
	isEdit: boolean;
	applyMagentaGreyTheme = true;
	newVenue: Venue;

	venueName: string | undefined;
	venueNumber: string | null;
	venueAdded: string;
	lastPlay: { $: { date: string } }[];
	venueObject: Venue = {
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
	};

	constructor(
		public dialogRef: MatDialogRef<VenueTableDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.newVenue = { ...this.venueObject };
	}
	ngOnInit(): void {
		if (this.data && this.data.existingRowData) {
			this.existingRowData = this.data.existingRowData;
			this.isEdit = true;
			if (this.data && this.data.existingRowData) {
				this.venueName = this.existingRowData.name[0] || '';
				this.venueNumber = this.existingRowData.$?.n;
				this.venueAdded = this.existingRowData.$?.adddate || '';
				this.lastPlay = [...this.existingRowData.lastplay];
				console.log('existing row data: ', this.existingRowData);
			}
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
		const finalData = { isNew: true || false, data: undefined };
		if (this.isEdit) {
			finalData.isNew = false;
			const updatedTeam = { ...this.data.existing };
			updatedTeam.name = [this.venueName];
			updatedTeam.$.n = this.venueNumber;
			updatedTeam.$.adddate = this.venueAdded;
			updatedTeam.lastPlay = this.lastPlay;
			finalData.data = updatedTeam;
		} else {
			finalData.isNew = true;
			const newTeam = { ...this.venueObject };
			newTeam.name = [this.venueName];
			finalData.data = newTeam;
		}
		this.dialogRef.close(finalData);
	}
	onCancel() {
		this.dialogRef.close();
	}
}
