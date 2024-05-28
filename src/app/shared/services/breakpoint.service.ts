import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, tap, distinctUntilChanged } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BreakpointService {
	constructor(private breakpointObserver: BreakpointObserver) {}

	get currentBreakpoint$(): Observable<string> {
		return this.breakpointObserver.observe(Object.values(Breakpoints)).pipe(
			map(state => {
				// console.log('BREAKPOINT: ',state);
				// console.log('Breakpoint : ', state);
				// console.log(
				// 	Object.keys(state.breakpoints).find(bp => state.breakpoints[bp] === true)
				// );

				let size = '';
				let width = 0;

				if (state.breakpoints[Breakpoints.XLarge]) {
					size = 'xlarge';
				} else if (state.breakpoints[Breakpoints.Large]) {
					size = 'large';
				} else if (state.breakpoints[Breakpoints.Medium]) {
					size = 'medium';
				} else if (state.breakpoints[Breakpoints.Tablet]) {
					size = 'tablet';
				} else {
					size = 'handset';
				}

				console.log('breakpoint size as determined by the bp service: ', size);
				return size;
			}),
			// Debugging
			// tap(value => console.log(value)),
			// Necessary
			distinctUntilChanged()
		);
	}
}
// Further responsiveness
// @Injectable({
// 	providedIn: 'root'
// })
// export class WindowSizeService {
// 	constructor(private breakpointObserver: BreakpointObserver) {}
// }
