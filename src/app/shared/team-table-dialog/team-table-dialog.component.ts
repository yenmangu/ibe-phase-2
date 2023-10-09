import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from '../data/interfaces/team-data';
@Component({
	selector: 'app-team-table-dialog',
	templateUrl: './team-table-dialog.component.html',
	styleUrls: ['./team-table-dialog.component.scss']
})
export class TeamTableDialogComponent implements OnInit {
	@Input() existingRowData: Team;
	isEdit: boolean;
	applyMagentaGreyTheme = true;
	newTeam: Team;

	teamName: string;
	teamNumber: string;
	teamAdded: string;
	lastPlay: { $: { date: string } }[];

	teamObject: Team = {
		$: {
			type: 'team',
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
		public dialogRef: MatDialogRef<TeamTableDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.newTeam = { ...this.teamObject };
	}

	ngOnInit(): void {
		if (this.data && this.data.existingRowData) {
			this.existingRowData = { ...this.data.existingRowData };
			this.isEdit = true;
			this.teamName = this.existingRowData.name[0] || '';
			this.teamAdded = this.existingRowData.$?.adddate || '';
			this.lastPlay = [...this.existingRowData.lastplay];
			console.log(this.existingRowData);
		}
		if (this.data && this.data.searchTerm) {
			this.teamName = this.data.searchTerm;
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
			this.teamAdded = new Date().toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit'
			});
		}
	}

	onSave(): void {
		const finalData = { isNew: true || false, data: undefined };
		if (this.isEdit) {
			finalData.isNew = false;
			const updatedTeam = { ...this.data.existing };
			updatedTeam.name = [this.teamName];
			updatedTeam.$.n = this.teamNumber;
			updatedTeam.$.adddate = this.teamAdded;
			updatedTeam.lastPlay = this.lastPlay;
			finalData.data = updatedTeam;
		} else {
			finalData.isNew = true;
			const newTeam = { ...this.teamObject };
			newTeam.name = [this.teamName];
			finalData.data = newTeam;
		}
		console.log(JSON.stringify(finalData, null, 2));
		this.dialogRef.close(finalData);
	}

	onCancel() {
		this.dialogRef.close();
	}
}
