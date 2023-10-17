import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormArray,
	Form,
	FormControl,
	AbstractControl
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
			scoringDataArray: this.fb.array([])
		});

		boardsScoringData.forEach((item: BoardsScoringInterface) => {
			this.addScoringDataItem(item);
		});
	}

	ngOnInit(): void {
		console.log('checking data: ', this.scoringConfigForm);
		console.log('form controls: ', this.scoringDataArray.controls);
	}

	scoringFormEmit(): void {
		const data = this.scoringConfigForm.value;
		this.boardScoringEmitter.emit(data);
	}

	getControl(i: number, controlName: string) {
		return this.scoringDataArray.at(i).get(controlName);
	}

	get scoringDataArray(): FormArray {
		return this.scoringConfigForm.get('scoringDataArray') as FormArray;
	}

	addScoringDataItem(data: BoardsScoringInterface): void {
		this.scoringDataArray.push(
			this.fb.group({
				defaultSelected: new FormControl(data.defaultSelected),
				preferredDuration: new FormControl(data.preferredDuration),
				scoringMethods: new FormControl(data.scoringMethods)
			})
		);
	}

	get formControls() {
		return this.scoringConfigForm.get('rows') as FormArray;
	}
}
