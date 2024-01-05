import {
	Component,
	Input,
	OnInit,
	QueryList,
	ViewChildren,
	ElementRef,
	AfterViewInit,
	OnChanges,
	SimpleChanges,
	Output,
	EventEmitter
} from '@angular/core';
import { map, startWith } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
	selector: 'app-csv-mapping',
	templateUrl: './csv-mapping.component.html',
	styleUrls: ['./csv-mapping.component.scss']
})
export class CsvMappingComponent implements OnInit, AfterViewInit, OnChanges {
	@Input() uploadedFile: any | null = null;
	@Input() uploadedHeaders: any | null = null;
	@Output() headerEmitter: EventEmitter<any> = new EventEmitter<any>();
	@ViewChildren('saveMappingButton') saveMappingButtons: QueryList<MatButton>;
	buttonsArray: MatButton[] = [];
	@ViewChildren('clearButton') clearButtons: QueryList<MatButton>;
	clearButtonsArray: MatButton[] = [];
	@ViewChildren('joinColumnCheckbox') joinColumnCheckboxes: QueryList<MatCheckbox>;
	joinColumnArray: MatCheckbox[] = [];

	csvContent: string | ArrayBuffer | null = null;
	realHeaders: string[] = [];
	mappedHeaders: { original: string; mapped: string }[] = [];

	// Input here represents the input file header
	// Output here represents 'our' database headers
	selectedMapping: { [key: number]: { input: string; output: string } } = {};

	inputSelectedHeaders: string[] = [];
	outputSelectedHeaders: string[] = [];
	inputJoinedHeaders: string[] = [];

	finalSaveEnabled: boolean = false;

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

	inputFileHeaders: { name: string; selected: boolean }[] =
		[
			{ name: 'FIRST NAME', selected: false },
			{ name: 'SURNAME', selected: false },
			{ name: 'ALIAS', selected: false },
			{ name: 'STATUS', selected: false },
			{ name: 'EMAIL', selected: false },
			{ name: 'PHONE', selected: false },
			{ name: 'EBU', selected: false },
			{ name: 'BBOUSERNAME', selected: false }
		] || [];

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
		{ name: 'Name (First Name + Surname)', selected: false },
		{ name: 'Email', selected: false },
		{ name: 'Phone', selected: false },
		{ name: 'EBU', selected: false },
		{ name: 'BBO Username', selected: false }
	];

	ourHeaders: string[] = ['Name', 'Email', 'Phone', 'EBU', 'BBO User Name'];
	columnsToJoin: boolean[] = new Array(this.inputFileHeaders.length).fill(false);

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

		this.clearButtons.forEach(button => {
			this.clearButtonsArray.push(button);
		});

		this.joinColumnArray.forEach(checkbox => {
			this.joinColumnArray.push(checkbox);
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.uploadedHeaders) {
			this.inputFileHeaders = [];
			this.uploadedHeaders.forEach(header => {
				this.inputFileHeaders.push({ name: header, selected: false });
			});
		}
	}

	onInputSelectionChange(newValue: string, i: number) {
		console.log('event: ', newValue);
		this.inputSelectedHeaders[i] = newValue;
		this.inputJoinedHeaders[i] = '';
		this.enableButton(i);

		for (const headerItem of this.inputFileHeaders) {
			headerItem.selected = false;
			if (this.inputSelectedHeaders.includes(headerItem.name)) {
				headerItem.selected = true;
			}
		}
	}
	onInputJoinedSelectionChange(newValue: string, i: number) {
		this.inputJoinedHeaders[i] = newValue;

		for (const headerItem of this.inputFileHeaders) {
			if (
				this.inputSelectedHeaders.includes(headerItem.name) ||
				this.inputJoinedHeaders.includes(headerItem.name)
			) {
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

	handleCheckboxChange(index: number) {
		this.columnsToJoin[index] = !this.columnsToJoin[index];
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
				// Save the mapping
				this.selectedMapping[index] = {
					input: this.inputSelectedHeaders[index],
					output: this.outputSelectedHeaders[index]
				};
				buttonAtIndex.disabled = true;
				this.checkAllButtons();
			} else {
				console.log('Button at index is undefined or has no nativeElement');
			}
		} else {
			console.log('Invalid index or button not found');
		}
	}

	clearMapping(index) {
		const clearButtonAtIndex: MatButton = this.clearButtonsArray[index];
		const saveButtonAtIndex: MatButton = this.buttonsArray[index];
		if (clearButtonAtIndex) {
			this.inputSelectedHeaders[index] = null;
			this.selectedMapping[index] = null;
			saveButtonAtIndex.disabled = false;
			clearButtonAtIndex.disabled = true;
		}
	}

	private checkAllButtons() {
		this.finalSaveEnabled = this.buttonsArray.every(button => button.disabled);
	}

	enableImport() {}

	importAll() {}

	onImportClick() {
		this.headerEmitter.emit(this.selectedMapping);
	}
}
