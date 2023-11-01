import { OnInit, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges , OnDestroy} from '@angular/core';
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
export class BoardsScoringComponent implements OnInit, OnChanges, OnDestroy {
	@Input() scoringSettings: any;
	@Input() successMessage: boolean
	@Output() boardScoringEmitter: EventEmitter<any> = new EventEmitter<any>();

	scoringData: BoardsScoringInterface[] = boardsScoringData;
	scoringConfigForm: FormGroup;
	clicked: boolean = false

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
		// console.log('checking data: ', this.scoringConfigForm);
		// console.log('form controls: ', this.scoringDataArray.controls);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes.scoringSettings && this.scoringSettings.scoringConfigArray){
			// console.log('scoring component ngOnChanges: ', this.scoringSettings)
			this.populateForm(this.scoringSettings)
		}
	}

	populateForm(scoringSettings):void {
		const scoringConfigArray = scoringSettings.scoringConfigArray
		if(scoringConfigArray){
			// console.log('in populate form: ', scoringConfigArray);

		}


		scoringConfigArray.forEach((item, index)=> {
			const control = this.getControl(index,'defaultSelected');
			if(control){
				control.setValue(item.defaultSelected)
			}
			const preferredDurationControl = this.getControl(index,'preferredDuration')
			if(preferredDurationControl){
				preferredDurationControl.setValue(item.preferredDuration)
			}
			const scoringMethodsControl = this.getControl(index,'scoringMethods');
			if(scoringMethodsControl){
				scoringMethodsControl.setValue(item.scoringMethods)
			}

		})
		this.scoringConfigForm.get('neuberg').setValue(this.scoringSettings.neuberg)
		this.scoringConfigForm.get('tables').setValue(this.scoringSettings.tables)
	}

	getBoardsScoringValues(): void {
		const data = {
			formName: 'boardsScoring',
			xmlElement: 'scosets',
			formData: this.scoringConfigForm.value
		};
		// console.log('scoring form: ', data);

		this.boardScoringEmitter.emit(data);
		this.clicked = true
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
	ngOnDestroy(): void {
		this.successMessage = false;
	}
}
