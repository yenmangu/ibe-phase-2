import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.state';

const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectAdminData = createSelector(
	selectAdminState,
	state => state.data
);
export const selectAdminLoading = createSelector(
	selectAdminState,
	state => state.loading
);
export const selectAdminError = createSelector(
	selectAdminState,
	state => state.error
);
