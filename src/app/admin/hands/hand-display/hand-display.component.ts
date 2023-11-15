import { Component, Input, OnInit } from '@angular/core';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';
import { CurrentEventService } from '../../games/services/current-event.service';

@Component({
	selector: 'app-hand-display',
	templateUrl: './hand-display.component.html',
	styleUrls: ['./hand-display.component.scss']
})
export class HandDisplayComponent implements OnInit{
	@Input() handData: string[];
	constructor(private currentEventService: CurrentEventService) {}

	ngOnInit(): void {
		console.log('hand data: ',this.handData)
	}
}
