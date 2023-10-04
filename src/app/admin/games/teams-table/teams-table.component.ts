import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-teams-table',
	templateUrl: './teams-table.component.html',
	styleUrls: ['./teams-table.component.scss']
})
export class TeamsTableComponent {
	@Output() teamFormData: EventEmitter<any> = new EventEmitter<any>();
	teamsForm: FormGroup;

	getTeamFormData() {
		if (this.teamsForm.valid) {
			const formData = this.teamsForm;
			return formData;
		}
		return null;
	}
}
