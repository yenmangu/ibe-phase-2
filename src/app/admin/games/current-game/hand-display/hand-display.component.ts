import { Component, Input } from '@angular/core';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';
import { CurrentEventService } from '../../services/current-event.service';

@Component({
	selector: 'app-hand-display',
	templateUrl: './hand-display.component.html',
	styleUrls: ['./hand-display.component.scss']
})
export class HandDisplayComponent {
  @Input() handData: string[];
  constructor(private currentEventService: CurrentEventService) {}

}
