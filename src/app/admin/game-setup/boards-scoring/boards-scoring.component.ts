import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormArray,
	Form,
	FormControl,
	AbstractControl,
	Validators
} from '@angular/forms';
import { BoardsScoringInterface } from '../../games/data/boards-scoring';
import { boardsScoringData } from '../../games/data/data-store/boards-scoring-data';

@Component({
	selector: 'app-boards-scoring',
	templateUrl: './boards-scoring.component.html',
	styleUrls: ['./boards-scoring.component.scss']
})
export class BoardsScoringComponent implements OnInit {
	@Input() formValues: any;
	@Output() boardScoringEmitter: EventEmitter<any> = new EventEmitter<any>();

	scoringData: BoardsScoringInterface[] = boardsScoringData;
	scoringConfigForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.scoringConfigForm = this.fb.group({
			scoringDataArray: this.fb.array([]),
			neuberg: null,
			tables: null
		});

		boardsScoringData.forEach((item: BoardsScoringInterface, index: number) => {
			this.addScoringDataItem(item, index);
		});
	}

	ngOnInit(): void {
		console.log('checking data: ', this.scoringConfigForm);
		console.log('form controls: ', this.scoringDataArray.controls);
	}

	getBoardsScoringValues(): void {
		const data = {
			formName: 'boardsScoring',
			xmlElement: 'scosets',
			formData: this.scoringConfigForm.value
		};
		console.log('scoring form: ', data);

		this.boardScoringEmitter.emit(data);
	}

	getControl(i: number, controlName: string) {
		return this.scoringDataArray.at(i).get(controlName);
	}

	get scoringDataArray(): FormArray {
		return this.scoringConfigForm.get('scoringDataArray') as FormArray;
	}


	addScoringDataItem(data: BoardsScoringInterface, index: number): void {
		const newGroup = this.fb.group({
			defaultSelected: new FormControl(false),
			preferredDuration: new FormControl(data.preferredDuration[0].value),
			scoringMethods: new FormControl(data.scoringMethods[0].value)
		});
		newGroup.get('defaultSelected').valueChanges.subscribe((value: boolean) => {
			if (value) {
				this.scoringDataArray.controls.forEach((control, i) => {
					if (i !== index) {
						control.get('defaultSelected')?.setValue(false);
					}
				});
			}
		});
		this.scoringDataArray.push(newGroup);
	}

	get formControls() {
		return this.scoringConfigForm.get('rows') as FormArray;
	}
}
