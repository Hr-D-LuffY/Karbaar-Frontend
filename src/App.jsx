import { useEffect, useState } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from "react-router-dom";
import useAuthStore from "./stores/authStore.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/Login.jsx";
import Layout from "./components/layout/Layout";

import SplashScreen from "./components/SplashScreen";

import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";

const App = () => {
	const fetchMe = useAuthStore((state) => state.fetchMe);
	const [showSplash, setShowSplash] = useState(true);

	useEffect(() => {
		fetchMe();

		const timer = setTimeout(() => {
			setShowSplash(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<SplashScreen visible={showSplash} />
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<LoginPage />} />

					<Route
						element={
							<ProtectedRoute>
								<Layout />
							</ProtectedRoute>
						}
					>
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route
							path="/inventory"
							element={<PlaceholderPage title="Inventory" />}
						/>
						<Route path="/sales" element={<PlaceholderPage title="Sales" />} />
						<Route
							path="/customers"
							element={<PlaceholderPage title="Customers" />}
						/>
						<Route
							path="/workers"
							element={<PlaceholderPage title="Workers" />}
						/>
						{/* add more routes here */}
					</Route>

					<Route path="/" element={<Navigate to="/dashboard" />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
