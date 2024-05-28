import { Injectable } from '@angular/core';
import { navLinks } from '../data/nav-links';
import { NavLink } from '../data/interfaces/nav-link';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class LinkManagementService {
	private topBarLinks: BehaviorSubject<NavLink[]> = new BehaviorSubject([]);
	private drawerLinks: BehaviorSubject<NavLink[]> = new BehaviorSubject([]);

	private linkSubject: BehaviorSubject<NavLink[]> = new BehaviorSubject<NavLink[]>(
		navLinks
	);
	links$ = this.linkSubject.asObservable();

	constructor() {}

	updateLinks(links: NavLink[]): void {
		this.linkSubject.next(links);
		// ...
	}

	getLinks(): NavLink[] {
		return this.linkSubject.getValue();
	}

	// getTopBarLinks(): Observable<NavLink[]> {
	// 	return this.topBarLinks.asObservable();
	// }

	// getDrawerLinks(): Observable<NavLink[]> {
	// 	return this.drawerLinks.asObservable();
	// }

	// setTopBarLinks(links: NavLink[]): void {
	// 	this.topBarLinks.next(links);
	// }
	// setDrawerLinks(links: NavLink[]): void {
	// 	this.drawerLinks.next(links);
	// }
}
