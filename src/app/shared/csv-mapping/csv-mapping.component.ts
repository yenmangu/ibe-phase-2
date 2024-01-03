import {
	Component,
	Input,
	OnInit,
	QueryList,
	ViewChildren,
	ElementRef,
	AfterViewInit
} from '@angular/core';
import { map, startWith } from 'rxjs';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'app-csv-mapping',
	templateUrl: './csv-mapping.component.html',
	styleUrls: ['./csv-mapping.component.scss']
})
export class CsvMappingComponent implements OnInit, AfterViewInit {
	@Input() uploadedFile: any | null = null;
	@ViewChildren('saveMappingButton') saveMappingButtons: QueryList<MatButton>;
	buttonsArray: MatButton[] = [];

	csvContent: string | ArrayBuffer | null = null;
	realHeaders: string[] = [];
	mappedHeaders: { original: string; mapped: string }[] = [];

	inputSelectedHeaders: string[] = [];
	outputSelectedHeaders: string[] = [];

	// dev
	headers: string[] = [
		'FIRST NAME',
		'SURNAME',
		'ALIAS',
		'STATUS',
		'EMAIL',
		'PHONE',
		'EBU',
		'BBOUSERNAME'
	];

	testHeaders: any[] = [
		{ name: 'FIRST NAME', selected: false },
		{ name: 'SURNAME', selected: false },
		{ name: 'ALIAS', selected: false },
		{ name: 'STATUS', selected: false },
		{ name: 'EMAIL', selected: false },
		{ name: 'PHONE', selected: false },
		{ name: 'EBU', selected: false },
		{ name: 'BBOUSERNAME', selected: false }
	];

	testOurHeaders: any[] = [
		{ name: 'Name (First Name)', selected: false },
		{ name: 'Name (Surname)', selected: false },
		{ name: 'Email', selected: false },
		{ name: 'Phone', selected: false },
		{ name: 'EBU', selected: false },
		{ name: 'BBO Username', selected: false }
	];

	ourHeaders: string[] = ['Name', 'Email', 'Phone', 'EBU', 'BBO User Name'];

	ngOnInit(): void {
		if (this.uploadedFile) {
			console.log(this.uploadedFile);
		}
	}

	ngAfterViewInit(): void {
		console.log('Save buttons: ', this.saveMappingButtons);
		this.saveMappingButtons.changes
			.pipe(
				startWith(null),
				map(() => this.saveMappingButtons.toArray())
			)
			.subscribe(buttons => {
				console.log('Save Buttons: ', buttons);
			});
	}

	onInputSelectionChange(newValue: string, i: number) {
		console.log('event: ', newValue);
		this.inputSelectedHeaders[i] = newValue;
		this.enableButton(i);

		for (const headerItem of this.testHeaders) {
			headerItem.selected = false;
			if (this.inputSelectedHeaders.includes(headerItem.name)) {
				headerItem.selected = true;
			}
		}
	}

	onOutputSelectionChange(newValue: string, i: number) {
		this.outputSelectedHeaders[i] = newValue;
		this.enableButton(i);
		for (const headerItem of this.testOurHeaders) {
			headerItem.selected = false;
			if (this.outputSelectedHeaders.includes(headerItem.name)) {
				headerItem.selected = true;
			}
		}
	}

	private enableButton(index: number) {
		if (index >= 0 && index < this.buttonsArray.length) {
			const buttonAtIndex: MatButton = this.buttonsArray[index];
			if (buttonAtIndex) {
				buttonAtIndex.disabled = false;
			}
		} else {
			console.log('Invalid index or button not found');
		}
	}

	public saveMapping(index: number) {
		if (
			index >= 0 &&
			index < this.saveMappingButtons.length &&
			this.saveMappingButtons &&
			this.saveMappingButtons.toArray()[index]
		) {
			this.buttonsArray = this.saveMappingButtons.toArray();

			const buttonAtIndex: MatButton = this.buttonsArray[index];
			if (buttonAtIndex) {
				buttonAtIndex.disabled = true;
			} else {
				console.log('Button at index is undefined or has no nativeElement');
			}
		} else {
			console.log('Invalid index or button not found');
		}
	}
}
