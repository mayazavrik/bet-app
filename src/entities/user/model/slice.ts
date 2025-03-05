import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/shared/types/common";

interface UserState {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

const initialState: UserState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

if (typeof window !== "undefined") {
	const savedUser = localStorage.getItem("user");
	if (savedUser) {
		try {
			initialState.user = JSON.parse(savedUser);
			initialState.isAuthenticated = true;
		} catch (e) {
			console.error("Failed to parse user from localStorage", e);
		}
	}
}

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		loginSuccess: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.loading = false;

			if (typeof window !== "undefined") {
				localStorage.setItem("user", JSON.stringify(action.payload));
			}
		},
		loginFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearLoginError: (state) => {
			state.error = null;
		},
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;

			if (typeof window !== "undefined") {
				localStorage.removeItem("user");
			}
		},
	},
});

export const { loginStart, loginSuccess, loginFailure, clearLoginError, logout } =
	userSlice.actions;
export const userReducer = userSlice.reducer;
