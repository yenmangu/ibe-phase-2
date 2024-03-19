import { Component, EventEmitter, Output } from '@angular/core';
import { DrawerService } from '../services/drawer.service';

@Component({
	selector: 'app-header-nav-drawer',
	templateUrl: './header-nav-drawer.component.html',
	styleUrls: ['./header-nav-drawer.component.scss']
})
export class HeaderNavDrawerComponent {
	@Output() emitClose = new EventEmitter<boolean>();

	constructor(private drawerService: DrawerService) {}
	handleLinkClick() {
		console.log('Link clicked');
	}

	closeDrawer() {
		this.emitClose.emit(true);
	}
}
