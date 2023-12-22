import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, tap, distinctUntilChanged } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BreakpointService {
	constructor(private breakpointObserver: BreakpointObserver) {

	}

	get currentBreakpoint$(): Observable<string> {
		return this.breakpointObserver.observe(Object.values(Breakpoints)).pipe(
			map(state => {
				// console.log('BREAKPOINT: ',state);

				if (state.breakpoints[Breakpoints.Large]) {
					return 'large';
				} else if (state.breakpoints[Breakpoints.Tablet]) {
					return 'tablet';
				} else if (state.breakpoints[Breakpoints.Medium]) {
					return 'medium';

				} else {
					return 'handset';
				}
			}),
      // Debugging
			// tap(value => console.log(value)),
      // Necessary
			distinctUntilChanged()
		);
	}
}
