import { Component, OnInit } from '@angular/core';
import { WebhookService } from '../services/webhook.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-lin-extraction',
	templateUrl: './lin-extraction.component.html',
	styleUrls: ['./lin-extraction.component.scss']
})
export class LinExtractionComponent implements OnInit {
	linString: string = '';
	greyMagenta: boolean = true;
	linForm: FormGroup;

	stringArray: any[] = [];

	constructor(private webhook: WebhookService, private fb: FormBuilder) {}

	ngOnInit(): void {
		this.initLinForm();
	}

	initLinForm() {
		this.linForm = this.fb.group({
			linStringArray: this.fb.array([this.createLinInput()])
		});
	}

	createLinInput(): FormGroup {
		return this.fb.group({ linString: '' });
	}

	get linStrings(): FormArray {
		return this.linForm.get('linStringArray') as FormArray;
	}

	get linStringsGroup(): FormGroup[] {
		return this.linStrings.controls as FormGroup[];
	}

	addLinInput() {
		this.linStrings.push(this.createLinInput());
	}

	removeLinInput(index: number) {
		this.linStrings.removeAt(index);
	}

	onSubmit() {
		this.triggerSheetWebhook();
	}

	getLinStringsFormGroup(index: number): FormGroup {
		return this.linStrings.at(index) as FormGroup;
	}

	triggerSheetWebhook() {
		if (this.linString) {
			this.webhook.sendWebhookRequest(this.linString).subscribe({
				next: response => {},
				error: error => {}
			});
		}
	}

	addToArray() {}
}
