import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ChangeDetectorRef,
	ViewChild,
	ElementRef,
	Renderer2
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedDataService } from '../services/shared-data.service';
import { SidenavService } from '../services/sidenav.service';
import {
	Subject,
	Subscription,
	distinctUntilChanged,
	filter,
	switchMap,
	takeUntil,
	of
} from 'rxjs';
import { UserDetailsService } from '../services/user-details.service';
import { IndexedDatabaseStatusService } from '../services/indexed-database-status.service';
import { SharedGameDataService } from 'src/app/admin/games/services/shared-game-data.service';
import { BreakpointService } from '../services/breakpoint.service';
import { PasswordRecoverComponent } from 'src/app/auth/password-recover/password-recover.component';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from 'src/app/admin/navigation/navigation.service';
import {
	animate,
	state,
	style,
	transition,
	trigger,
	AnimationBuilder,
	AnimationPlayer
} from '@angular/animations';
import { DrawerService } from '../services/drawer.service';
import { AdminToolsService } from '../services/admin-tools.service';
import { NavLink } from '../data/interfaces/nav-link';
import { navLinks } from '../data/nav-links';
import { LinkManagementService } from '../services/link-management.service';
import { IconRegistryService } from '../services/icon-registry.service';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
	// animations: [
	// 	trigger('drawerAnimation', [
	// 		state('opened', style({ height: '{{ height }}', minHeight: '64px' })),
	// 		state('closed', style({ height: '0' })),
	// 		transition('opened <=> closed', animate('300ms ease'))
	// 	])
	// ]
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('topBar') topBar: ElementRef;
	@ViewChild('drawer') drawerEl: ElementRef;
	isAuthenticated: boolean = false;
	isSidenavOpen = false;
	isDataReady: boolean = false;
	gameCode: string = '';
	email: string = '';
	dataReadySubscription = new Subscription();
	gameCodeSubscription = new Subscription();
	emailSubscription = new Subscription();
	userLoggedOut: boolean = false;
	currentBreakpoint;
	isPublicLink: boolean = false;
	animationPlayer: AnimationPlayer | null = null;

	isNavLoaded: boolean = false;
	authed: boolean | null = null;

	isSuperAdmin: boolean | null = null;

	drawerState: 'opened' | 'closed' = 'closed';

	allLinks: NavLink[] = navLinks;

	height: '64px' | '120px' | '0px' = '0px';

	topBarLinks: NavLink[] = [];
	drawerLinks: NavLink[] = [];

	private sidenavSubscription: Subscription;
	private destroy$ = new Subject<void>();
	constructor(
		private router: Router,
		public authService: AuthService,
		public sharedDataService: SharedDataService,
		private drawerService: DrawerService,
		private sidenavService: SidenavService,
		public userDetailsService: UserDetailsService,
		private cdr: ChangeDetectorRef,
		private IDBStatus: IndexedDatabaseStatusService,
		private sharedGameDataService: SharedGameDataService,
		private breakpointService: BreakpointService,
		private dialog: MatDialog,
		private navigationService: NavigationService,
		private adminToolsService: AdminToolsService,
		private linkManagement: LinkManagementService,
		private renderer: Renderer2,
		private animationBuilder: AnimationBuilder
	) {}

	ngOnInit(): void {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				this.isPublicLink = this.checkRoute();
			});

		this.userDetailsService.updateFromLocalStorage();
		this.cdr.detectChanges();
		this.sharedDataService.logout$.subscribe(logout => {
			if (logout) {
				this.logout();
			}
		});

		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(breakpoint => {
				this.currentBreakpoint = breakpoint;
				if (this.drawerState === 'closed') {
					this.height = '0px';
				} else {
					this.getDrawerHeight();
				}
				// console.log('Updating links ');
				// this.updateLinks(breakpoint);
			});

		this.authService.isAuthedSubject$.subscribe(authed => {
			if (authed) {
				this.authed = authed;
			} else {
				this.authed = false;
			}
		});

		this.userDetailsService.gameCode$
			.pipe(
				switchMap(gameCode => {
					if (gameCode) {
						console.log('gameCode: ', gameCode);
						this.gameCode = gameCode;
						// const stringGamecode = this.gameCode.toString();
						// console.log('String Gamecode: ', this.gameCode);

						// this.gameCode = gameCode;
						return this.adminToolsService.verifyAdmin(this.gameCode);
					} else {
						return of(null);
					}
				})
			)
			.subscribe(response => {
				// console.log('Response in component: ', response);

				if (response.authStatus === true) {
					this.isSuperAdmin = true;
				} else if (response.authStatus === false) {
					this.isSuperAdmin = false;
				} else {
					console.error('Error in verifying admin, ', response);
				}
			});

		this.navigationService.getLoaded().subscribe(loaded => {
			this.isNavLoaded = loaded;
		});

		this.drawerService.isOpen$
			.pipe(takeUntil(this.destroy$), distinctUntilChanged())
			.subscribe(state => {
				// console.log('Drawer state: ', state);

				state === true ? (this.drawerState = 'opened') : 'closed';
			});
	}

	ngAfterViewInit(): void {}
	createAnimation() {
		const factory = this.animationBuilder.build([
			this.drawerState === 'opened'
				? style({ height: '0' })
				: style({ height: this.height }),
			this.drawerState === 'opened'
				? animate('300ms ease', style({ height: this.height }))
				: animate('300ms ease', style({ height: '0' }))
		]);
		const player = factory.create(this.drawerEl.nativeElement);
		player.play();
		this.animationPlayer = player;
	}
	// createAnimation() {
	// 	const targetHeight = this.drawerState === 'opened' ? this.height : '0';
	// 	const factory = this.animationBuilder.build([
	// 		style({ height: targetHeight }),
	// 		animate('300ms ease', style({ height: targetHeight }))
	// 	]);
	// 	const player = factory.create(document.querySelector('.drawer'));
	// 	player.play();
	// 	this.animationPlayer = player;
	// }

	checkRoute(): boolean {
		const urlSegments = this.router.url.split('/');
		const firstPath = urlSegments.length > 1 && urlSegments[1];
		// console.log('first path: ', firstPath);

		if (firstPath.startsWith('starting-lineup')) {
			return true;
		} else {
			return false;
		}
	}

	getDrawerHeight(): void {
		if (this.drawerState === 'closed') {
			return;
		}
		if (
			this.currentBreakpoint === 'handset' ||
			this.currentBreakpoint === 'medium'
		) {
			this.height = '120px';
		} else {
			this.height = '64px';
		}
	}

	toggleSidenav(): void {
		this.sidenavService.toggle();
		// console.log('sidenav button clicked');
	}

	toggleDrawer() {
		const drawer = this.drawerEl.nativeElement;
		this.drawerState = this.drawerState === 'opened' ? 'closed' : 'opened';
		this.getDrawerHeight();

		drawer.classList.toggle('opened');
		if (this.animationPlayer) {
			this.animationPlayer.destroy();
		}
		this.createAnimation();
		// this.updateDrawerHeight();
		this.drawerService.toggle();
	}

	isLoggedIn(): boolean {
		return this.isAuthenticated;
	}

	refreshDatabase(): void {
		this.sharedGameDataService.triggerRefreshDatabase();
	}

	logout(): void {
		this.IDBStatus.resetProgress();
		this.authService.logout();
		this.userLoggedOut = true;
		this.userDetailsService.loggedInSubject.next(false);
		this.cdr.detectChanges();
		this.router.navigate(['/home']);
	}

	forgotPassword(): void {
		// console.log('Forgot password clicked');
		const dialogRef = this.dialog
			.open(PasswordRecoverComponent, {
				width: '400px',
				data: {}
			})
			.afterClosed()
			.subscribe({
				next: success => {
					if (success) {
						console.log('Success resetting password');
					}
				},
				error: error => {
					console.error('Error resetting password');
				}
			});
	}

	// updateLinks(breakpoint: string): void {
	// 	const allLinks: NavLink[] = this.linkManagement.getLinks();
	// 	const maxVisibleLinks: number = this.getMaxVisibleLinks(breakpoint);
	// 	console.log('Max visible links after getting max: ', maxVisibleLinks);

	// 	const topLinks = allLinks.filter(link => link.position === 'top');
	// 	const drawerLinks = allLinks.filter(link => link.position === 'bottom');
	// 	console.log('about to check links');

	// 	// const linksToMove: NavLink[] = topLinks.slice(maxVisibleLinks);
	// 	if (topLinks.length === 5) {
	// 		console.log('5 links in menu');

	// 		this.updateDrawerHeight(true);
	// 	}
	// 	console.log(
	// 		'Max visible links before checking against top links: ',
	// 		maxVisibleLinks
	// 	);

	// 	if (topLinks.length > maxVisibleLinks) {
	// 		const linksToMove: NavLink[] = topLinks.splice(maxVisibleLinks);
	// 		linksToMove.forEach(link => {
	// 			link.position = 'bottom';
	// 		});
	// 	}

	// 	if (topLinks.length < maxVisibleLinks && drawerLinks.length > 0) {
	// 		const spaceAvailable: number = maxVisibleLinks - topLinks.length;
	// 		const linksToMove: NavLink[] = drawerLinks.splice(0, spaceAvailable);
	// 		linksToMove.forEach(link => {
	// 			link.position = 'top';
	// 		});
	// 	}

	// 	console.log('visible links: ', maxVisibleLinks);
	// 	console.log('top links: ', topLinks);
	// 	console.log('drawer links: ', drawerLinks);

	// 	this.linkManagement.updateLinks(allLinks);
	// 	this.updateDrawerHeight();
	// }

	// getMaxVisibleLinks(breakpoint: string): number {
	// 	switch (breakpoint) {
	// 		case 'handset':
	// 			return 5;
	// 		case 'medium':
	// 			return 5;

	// 		default:
	// 			return 5;
	// 	}
	// }

	ngOnDestroy(): void {
		this.sidenavSubscription.unsubscribe();
		this.destroy$.next();
		this.destroy$.complete();
	}
}
