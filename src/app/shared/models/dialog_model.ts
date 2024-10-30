export interface DialogModel {
	dialogName: string;
	width: string;
	data:
		| {
				code?: string;
				title: string;
				message: string;
				gameCode?: string | null;
				email?: string | null | undefined;
				dirKey?: string | null | undefined;
				error?: string | undefined;
		  }
		| any;
}
