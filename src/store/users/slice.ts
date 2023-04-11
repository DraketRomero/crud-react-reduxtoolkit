import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const DEFAULT_STATE = [
	{
		id: "1",
		name: "Diego Romero",
		email: "draketromero@gmail.com",
		github: "DraketRomero",
	},
	{
		id: "2",
		name: "Maria Garrido",
		email: "mariagarr@gmail.com",
		github: "NenucoProgramador",
	},
	{
		id: "3",
		name: "Angie Coronel",
		email: "pandaLogic@gmail.com",
		github: "midudev",
	},
];

export type UserId = string;

export interface User {
	name: string;
	email: string;
	github: string;
}

export interface UserWithId extends User {
	id: UserId;
}

const initialState: UserWithId[] = (() => {
	const persistedState = localStorage.getItem("__redux__state__");

	if (persistedState) return JSON.parse(persistedState).users;

	return DEFAULT_STATE;
})();

export const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		addNewUser: (state, action: PayloadAction<User>) => {
			const id = crypto.randomUUID();
			return [...state, { id, ...action.payload }];
		},

		deleteUserById: (state, action: PayloadAction<UserId>) => {
			const id = action.payload;
			return state.filter((user) => user.id !== id);
		},
		rollbackUser: (state, action: PayloadAction<UserWithId>) => {
			const isUserAlreadyDefined = state.some(
				(user) => user.id === action.payload.id,
			);

			if (!isUserAlreadyDefined) {
				return [...state, action.payload];
			}
		},
	},
});

export default usersSlice.reducer;
export const { addNewUser, deleteUserById, rollbackUser } = usersSlice.actions;
