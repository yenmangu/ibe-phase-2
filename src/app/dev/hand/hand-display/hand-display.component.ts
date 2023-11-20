import { Component, Input, OnInit } from '@angular/core';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';

@Component({
	selector: 'app-hand-display',
	templateUrl: './hand-display.component.html',
	styleUrls: ['./hand-display.component.scss']
})
export class HandDisplayComponent implements OnInit {
	@Input() handData: string[];
  @Input() cardsArray: any

  constructor(private iconRegistryService: IconRegistryService){}

	ngOnInit(): void {
		console.log('handData in display component: ', this.handData);
	}
}
