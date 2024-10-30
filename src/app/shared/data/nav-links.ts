import { NavLink } from './interfaces/nav-link';

export const navLinks: NavLink[] = [
	{
		routerLink: '/admin/game-setup',
		label: 'App Settings',
		position: 'top',
		textCol: 'green',
		icon: 'game-code-settings'
	},
	{
		routerLink: '/admin/player-database',
		label: 'Player Database',
		position: 'top',
		textCol: 'green',
		icon: 'player-db'
	},
	{
		routerLink: '/admin/games',
		label: 'Current Session',
		position: 'top',
		textCol: 'green',
		icon: 'current-session'
	},
	{
		routerLink: '/admin/hand-records',
		label: 'Hand Records',
		position: 'top',
		textCol: 'green',
		icon: 'hand-records'
	},
	{
		routerLink: '/admin/reporting',
		label: 'Reports',
		position: 'top',
		textCol: 'green',
		icon: 'reports'
	},
	{
		routerLink: '/admin/user-actions',
		label: 'Activity',
		position: 'bottom',
		textCol: 'yellow',
		icon: 'activity'
	},
	{
		routerLink: '/admin/account',
		label: 'Account Settings',
		position: 'bottom',
		textCol: 'magenta',
		icon: 'account-settings'
	},
	{
		routerLink: '/admin/database-admin',
		label: 'Database Admin',
		position: 'bottom',
		textCol: 'magenta',
		icon: 'database-admin'
	},
	{
		routerLink: '/admin/historic-games',
		label: 'Historic Games',
		position: 'bottom',
		textCol: 'magenta',
		icon: 'historic-games'
	},
	{
		routerLink: '/admin/admin-tools',
		label: 'Admin Tools',
		position: 'bottom',
		textCol: 'magenta',
		icon: 'admin-tools'
	}
];
