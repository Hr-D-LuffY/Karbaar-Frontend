import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import useAuthStore from "../../stores/authStore";

const PAGE_TITLES = {
	"/dashboard": null,
	"/add-product": "action_add_product",
	"/press-list": "press_list",
	"/press-add": "press_add",
	"/settings": "settings",
	// add all your routes here, values are translation keys
};

export default function SubHeader() {
	const user = useAuthStore((state) => state.user);
	const { t, lang } = useLang();
	const [datetime, setDatetime] = useState("");
	const location = useLocation();
	const navigate = useNavigate();

	const titleKey = PAGE_TITLES[location.pathname];
	const isDashboard = location.pathname === "/dashboard";

	useEffect(() => {
		const update = () => {
			const now = new Date();
			const formatted = now.toLocaleDateString(
				lang === "bn" ? "bn-BD" : "en-US",
				{
					weekday: "long",
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: true,
				},
			);
			setDatetime(formatted);
		};
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	}, [lang]);

	return (
		<div className="lg:ml-64 bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
			<div className="flex items-center gap-3">
				<div className="w-1.5 h-6 bg-cyan-500 rounded-full" />

				{isDashboard ?
					<h1 className="text-2xl font-semibold text-gray-900">
						{t("welcome")} {user?.press_name}!
					</h1>
				:	<>
						<button
							onClick={() => navigate(-1)}
							className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
						>
							<span className="material-symbols-outlined text-[20px] text-gray-600">
								arrow_back
							</span>
						</button>
						<h1 className="text-2xl font-semibold text-gray-900">
							{titleKey ? t(titleKey) : ""}
						</h1>
					</>
				}
			</div>

			<div className="flex items-center gap-2 text-gray-500">
				<span className="material-symbols-outlined text-[18px]">schedule</span>
				<p className="text-sm font-medium font-mono">{datetime}</p>
			</div>
		</div>
	);
}
