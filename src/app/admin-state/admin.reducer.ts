import { createReducer, on } from "@ngrx/store";
import { loadAdminData, loadAdminDataSuccess, LoadAdminDataFailure } from "./admin.actions";
import { AdminState } from "./admin.state";

const initialState: AdminState = {
	data: null,
	loading:null,
	progress: null,
	error: null
}

export const adminReducer = createReducer(
	initialState,
	on(loadAdminData, (state)=> ({
		...state,
		loading: true,
		progress: 0,
		error: null
	})),
	on(loadAdminDataSuccess, (state, {data})=> ({
		...state,
		data,
		loading: false,
		progress: 100,
		error: null
	})),
	on(LoadAdminDataFailure, (state, {error})=> ({
		...state,
		loading: false,
		progress: 100,
		error
	}))
)