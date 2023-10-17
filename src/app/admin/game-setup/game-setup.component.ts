import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiDataCoordinationService } from '../games/services/api/api-data-coordination.service';

@Component({
	selector: 'app-game-setup',
	templateUrl: './game-setup.component.html',
	styleUrls: ['./game-setup.component.scss']
})
export class GameSetupComponent implements OnInit {
	setupForm: FormGroup;
	scoringForm: any;

	applyMagentaGreyTheme = true;
	constructor(
		private breakpointService: BreakpointService,
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		this.setupForm = this.fb.group({
			newEventUses: 'previous',
			twoPageStartup: false,
			tdEntersNames: false,
			requireAllNames: false,
			teamSignIn: false,
			// Security
			onGameCreation: 'no-lock-change',
			usePin: false,
			spectateApp: false,
			spectateWebsite: false
		});
		this.setupForm.valueChanges.subscribe(values => {
			// console.log('form values: ', values);
		});
	}
	save(): void {
		const data = this.setupForm.value;
		console.log('set up form data: ', data);
	}

	onChildForm(formData: any): void {
		console.log('all form data: ', formData);
	}

	onPlayerIdForm(formData: any): void {
		console.log('Player ID Form: ', formData);
	}

	onScoringForm(formData: any): void {
		console.log('Scoring form data: ', formData);
	}

	onAppInterfaceForm(formData: any) {
		console.log('app-interface form data: ', formData);
	}

	onNamingNumberingForm(formData: any) {
		console.log('Naminng-numbering form data: ', formData);
	}
}
