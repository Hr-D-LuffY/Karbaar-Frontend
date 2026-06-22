import { Outlet } from "react-router-dom";
import TopAppBar from "./TopAppBar";
import SubHeader from "./SubHeader";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

export default function Layout() {
	return (
		<div className="bg-[#f7f9fb] text-gray-900 min-h-screen">
			<TopAppBar />
			<Sidebar />
			<SubHeader />
			<main className="lg:ml-64 px-4 md:px-8 py-6 space-y-6 min-h-[calc(100vh-140px)] pb-24 lg:pb-8">
				<Outlet />
			</main>
			<div className="lg:ml-64">
				<Footer />
			</div>
			<BottomNav />
		</div>
	);
}
