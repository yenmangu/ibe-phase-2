import { createAction, props } from '@ngrx/store';

export const loadAdminData = createAction('[Admin] Load Data');
export const loadAdminDataSuccess = createAction(
	'[Admin] Load Data Success',
	props<{ data: any }>()
);
export const LoadAdminDataFailure = createAction(
	'[Admin] Load Data Failure',
	props<{ error: string }>()
);
