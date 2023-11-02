export interface DialogModel {
	dialogName: string;
	width: string;
	data:
		| {
				title: string;
				message: string;
				gameCode?: string | null;
				email?: string | null;
				dirKey?: string | null;
				error?: string;
		  }
		| any;
}
