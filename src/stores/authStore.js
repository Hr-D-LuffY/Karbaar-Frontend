import { create } from "zustand";
import { apiFetch } from "../api/fetch.js";

const useAuthStore = create((set) => ({
	user: null, // stores logged in user info
	loading: true, // true on first load while we check if user is logged in

	login: async (identifier, password, rememberMe) => {
		const data = await apiFetch("/auth/login", {
			method: "POST",
			body: JSON.stringify({ identifier, password, rememberMe }),
		});
		set({ user: data.user });
	},

	logout: async () => {
		await apiFetch("/auth/logout", { method: "POST" });
		set({ user: null });
	},

	fetchMe: async () => {
		try {
			const data = await apiFetch("/auth/me");
			set({ user: data, loading: false });
		} catch {
			set({ user: null, loading: false });
		}
	},
}));

export default useAuthStore;
