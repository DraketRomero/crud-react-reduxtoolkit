import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";
import usersReducer, { rollbackUser } from "./users/slice";

const persistanceLocalStorageMiddleware: Middleware =
	(store) => (next) => (action) => {
		next(action);
		localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
	};

const syncWithDatabaseMiddleware: Middleware =
	(store) => (next) => (action) => {
		const { type, payload } = action;
		const previousState = store.getState();

		// fase 1
		console.log({ type, payload });
		console.log(store.getState());
		next(action);

		if (type === "users/deleteUserById") {
			const userIdToRemvoe = payload;
			const userToRemove = previousState.users.find(
				(user) => user.id === userIdToRemvoe,
			);
			fetch(`https://jsonplaceholder.typicode.com/users/${userIdToRemvoe}`, {
				method: "DELETE",
			})
				.then((res) => {
					if (res.ok) {
						toast.success("Exito!");
					}

					throw new Error("Error al eliminar el usuario");
				})
				.catch(() => {
					toast.error(`Error deleting user ${userIdToRemvoe}`);
					if (userToRemove) store.dispatch(rollbackUser(userToRemove));
					console.log("error");
				});
		}
	};

export const store = configureStore({
	reducer: {
		users: usersReducer,
	},
	middleware: [persistanceLocalStorageMiddleware, syncWithDatabaseMiddleware],
});

// Retorna el tipo del tipo que es la funcion "sore.getState"
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
