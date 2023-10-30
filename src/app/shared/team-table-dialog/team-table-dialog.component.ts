import { Component } from '@angular/core';

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
		key: '',
		value: {
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
		}
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
			this.teamName = this.existingRowData.value.name[0] || '';
			this.teamAdded = this.existingRowData.value.$?.adddate || '';
			this.lastPlay = [...this.existingRowData.value.lastplay];
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
			const updatedTeam: Team = { ...this.data.existing };
			updatedTeam.value.name = [this.teamName];
			updatedTeam.value.$.n = this.teamNumber;
			updatedTeam.value.$.adddate = this.teamAdded;
			updatedTeam.value.lastplay = this.lastPlay;
			finalData.data = updatedTeam;
		} else {
			finalData.isNew = true;
			const newTeam: Team = { ...this.teamObject };
			newTeam.value.name = [this.teamName];
			finalData.data = newTeam;
		}
		console.log(JSON.stringify(finalData, null, 2));
		this.dialogRef.close(finalData);
	}

	onCancel() {
		this.dialogRef.close();
	}
}
