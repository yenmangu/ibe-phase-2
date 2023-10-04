import { DialogModel } from '../models/dialog_model';

export const dialogData: DialogModel[] = [
	{
		dialogName: 'registrationSuccess',
		width: '400px',
		data: {
			title: 'SUCCESS',
			message:
				'was successfully created. You will receive an Email to the Email address provided with your account details. Please click below to visit the home page.',
			gameCode: ''
		}
	},
	{
		dialogName: 'registrationFail',
		width: '400px',
		data: {
			title: 'REGISTRATION FAILED',
			message: `It seems there has been an error registering. Please try again or contact <a href="mailto:admin@ibescore.com">admin@ibescore.com</a>`,
			gameCode: ''
		}
	},
	{
		dialogName: 'registrationFail_GAMECODE',
		width: '400px',
		data: {
			title: 'REGISTRATION FAILED',
			message: 'is already in use',
			gameCode: ''
		}
	},
	{
		dialogName: 'testDialog',
		width: '400px',
		data: {
			title: 'TEST_TITLE',
			message: 'test message.',
			gameCode: null
		}
	},
	{
		dialogName: 'loginRegisterDialog',
		width: '400px',
		data: {}
	},
	{
		dialogName: 'genericDialog',
		width: '400px',
		data: {}
	}
];
