import { Component, OnInit } from '@angular/core';
import { BreakpointService } from './shared/services/breakpoint.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'ibescore_2';
	currentBreakpoint: string = '';
	constructor(private breakpointService: BreakpointService) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(bp => {
			this.currentBreakpoint = bp;
		});
	}
}
