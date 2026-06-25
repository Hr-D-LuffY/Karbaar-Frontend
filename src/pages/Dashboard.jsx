import useAuthStore from "../stores/authStore.js";

const Dashboard = () => {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);

	return (
		<div>
			<h1>Welcome, {user?.press_name}!</h1>
			<p>Email: {user?.email}</p>
			<p>Business Type: {user?.business}</p>
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default Dashboard;
