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
				return size;
			}),
			distinctUntilChanged()
			// ,tap(size=>console.log('Breakoint Changed with: ', size))
		);
	}
}
