import { DialogModel } from '../models/dialog_model';

export const dialogData: DialogModel[] = [
	{
		dialogName: 'registrationSuccess',
		width: '400px',
		data: {
			code: 'regSUCCESS',
			title: 'SUCCESS',
			message:
				'was successfully created. You will receive an Email to the Email address provided with your account details. Please click below to visit the home page.',
			gameCode: ''
		}
	},
	{
		dialogName: 'passFail',
		width: '400px',
		data: {
			code: 'PASS',
			title: 'Incorrect Director Key',
			message:'Please check your details and try again',
			gameCode: ''
		}
	},
	{
		dialogName: 'emailFail',
		width: '400px',
		data: {
			code: 'EMAIL',
			title: 'Email not found',
			message:'Please check your email and try again',
			gameCode: ''
		}
	},
	{
		dialogName: 'generalFail',
		width: '400px',
		data: {
			code: 'EMAIL',
			title: 'Error Logging In',
			message:'Please contact admin@ibescore.com',
			gameCode: ''
		}
	},
	{
		dialogName: 'userFail',
		width: '400px',
		data: {
			code: 'USER',
			title: 'User not found',
			message:'Please check your email and try again',
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
		dialogName: 'forgotPASSWORD',
		width: '400px',
		data: {
			code: 'FORGOT',
			title: 'Request new director key'
		}
	},
	{
		dialogName: 'keyUpdateSuccess',
		width: '400px',
		data: {
			code: 'updateSUCCESS',
			title: 'SUCCESS',
			message: 'Your director key has been successfully changed to: ',
			dirKey: ''
		}
	},
	{
		dialogName: 'emailUpdateSuccess',
		width: '400px',
		data: {
			code: 'updateSUCCESS',
			title: 'SUCCESS',
			message: 'Your email has been successfully changed to: ',
			email: ''
		}
	},
	{
		dialogName: 'errorUpdatingEmail',
		width: '400px',
		data: {
			title: 'Error updating Email',
			message: 'There has been an error updating your Email',
			error: ''
		}
	},
	{
		dialogName: 'errorUpdatingKey',
		width: '400px',
		data: {
			title: 'Error updating director key',
			message: 'There has been an error updating your director key',
			error: ''
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
		dialogName: 'PURGE',
		width: '400px',
		data: {
			code: 'PURGE',
			title: 'Purge Current Game',
			message: 'Are you sure you want to purge?',
			message_2:
				'This will delete all trace of the current event - movement, results, adjustmentsand rankings - without any possibility of recovering them. Are you sure?'
		}
	},
	{
		dialogName: 'genericDialog',
		width: '400px',
		data: {}
	},
	{
		dialogName: 'BBO',
		width: '600px',
		data: {
			code: 'BBO',
			title: 'Upload BBO Digest'
		}
	}
];
