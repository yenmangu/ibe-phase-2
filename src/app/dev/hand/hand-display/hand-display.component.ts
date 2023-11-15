import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-hand-display',
	templateUrl: './hand-display.component.html',
	styleUrls: ['./hand-display.component.scss']
})
export class HandDisplayComponent {
	@Input() handData: string[];
}
