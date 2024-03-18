import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
	selector: 'app-header-nav',
	templateUrl: './header-nav.component.html',
	styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent {
	constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

	public handleLinkClick() {
		console.log('link clicked');
	}
}
