import { Component, OnInit } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
@Component({
	selector: 'app-welcome-screen',
	templateUrl: './welcome-screen.component.html',
	styleUrls: ['./welcome-screen.component.scss']
})
export class WelcomeScreenComponent implements OnInit {
	currentBreakpoint: string = '';
	constructor(private bp: BreakpointService) {}

	ngOnInit(): void {
		this.bp.currentBreakpoint$.subscribe(bp => {
			this.currentBreakpoint = bp;
		});
	}
}
