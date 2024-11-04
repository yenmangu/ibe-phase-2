import { NavLink } from './interfaces/nav-link';

export const navLinks: NavLink[] = [
	{
		routerLink: '/admin/game-setup',
		label: 'App Settings',
		position: 'top',
		textCol: 'green',
		icon: 'game-code-settings',
		aria: 'Mobile app settings'
	},
	{
		routerLink: '/admin/player-database',
		label: 'Player Database',
		position: 'top',
		textCol: 'green',
		icon: 'player-db',
		aria: 'Player database'
	},
	{
		routerLink: '/admin/games',
		label: 'Current Session',
		position: 'top',
		textCol: 'green',
		icon: 'current-session',
		aria: 'Current session'
	},
	{
		routerLink: '/admin/hand-records',
		label: 'Hand Records',
		position: 'top',
		textCol: 'green',
		icon: 'hand-records',
		aria: 'Hand records'
	},
	{
		routerLink: '/admin/reporting',
		label: 'Reports',
		position: 'top',
		textCol: 'green',
		icon: 'reports',
		aria: 'Reports'
	},
	{
		routerLink: '/admin/user-actions',
		label: 'Activity',
		position: 'bottom',
		textCol: 'yellow',
		icon: 'activity',
		aria: 'Activity'
	},
	{
		routerLink: '/admin/account',
		label: 'Account Settings',
		position: 'bottom',
		textCol: 'magenta',
		icon: 'account-settings',
		aria: 'Account settings'
	},
	{
		routerLink: '/admin/database-admin',
		label: 'Database Admin',
		position: 'bottom',
		textCol: 'magenta',
		icon: 'database-admin',
		aria: 'Database admin'
	},
	{
		routerLink: '/admin/historic-games',
		label: 'Historic Games',
		position: 'bottom',
		textCol: 'magenta',
		icon: 'historic-games',
		aria: 'Historic games'
	},
	{
		routerLink: '/admin/admin-tools',
		label: 'Admin Tools',
		position: 'bottom',
		textCol: 'magenta',
		icon: 'admin-tools',
		aria: 'Admin tools'
	}
];
