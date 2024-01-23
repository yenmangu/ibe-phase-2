import { Component, OnInit } from '@angular/core';
import { AdminToolsService } from '../services/admin-tools.service';
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

	constructor(private webhook: AdminToolsService, private fb: FormBuilder) {}

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

	getValues() {
		const values = { ...this.linForm.value };
		const valueObject: any = {};
		const valueArray: any[] = [];
		values.linStringArray.forEach((value, i) => {
			const urlObject = { url: value.linString };
			valueArray.push(urlObject);
		});
		console.log('values from lin form: ', values);
		return valueArray;
	}

	triggerSheetWebhook() {
		if (this.linForm) {
			const linFormValues = this.getValues();
			console.log('Lin form values: ', linFormValues);

			this.webhook.sendUrls(linFormValues).subscribe({
				next: (response: Blob) => {
					const blob = new Blob([response], { type: 'text/plain' });
					const blobURL = window.URL.createObjectURL(blob);

					const link = document.createElement('a');
					link.href = blobURL;
					link.download = 'extracted-lin-strings.txt';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				},
				error: error => {}
			});
		}
	}

	addToArray() {}
}
