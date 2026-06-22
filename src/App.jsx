import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./context/LangContext";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import SplashScreen from "./components/SplashScreen";

export default function App() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<LangProvider>
			{/* Splash — stays mounted for 500ms fade-out after loading=false */}
			<SplashScreen visible={loading} />

			{/* App renders underneath, becomes visible after fade */}
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<DashboardPage />} />
						<Route
							path="inventory"
							element={<PlaceholderPage title="Inventory" />}
						/>
						<Route path="sales" element={<PlaceholderPage title="Sales" />} />
						<Route
							path="customers"
							element={<PlaceholderPage title="Customers" />}
						/>
						<Route
							path="workers"
							element={<PlaceholderPage title="Workers" />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</LangProvider>
	);
}
