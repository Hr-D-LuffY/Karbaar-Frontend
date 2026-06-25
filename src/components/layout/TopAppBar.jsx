import { useLang } from "../../context/LangContext";
import useAuthStore from "../../stores/authStore";
import { Link } from "react-router-dom";
import paperImg from "../../assets/klogo.png";

export default function TopAppBar() {
	const { lang, setLang, t } = useLang();
	const logout = useAuthStore((state) => state.logout);

	return (
		<header className="bg-white border-b-2 border-gray-200 shadow-sm flex justify-between items-center w-full px-4 md:px-8 py-1 sticky top-0 z-50">
			{/* Left: Logo + Name */}
			<Link to="/dashboard" className="flex items-center gap-3">
				<img
					src={paperImg}
					alt="Paper"
					className="w-13 h-12 lg:w-18 lg:h-15 object-contain"
				/>
			</Link>

			{/* Right: Lang toggle + Logout */}
			<div className="flex items-center gap-4">
				<div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
					<button
						onClick={() => setLang("en")}
						className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all duration-200 ${
							lang === "en" ?
								"bg-cyan-500 text-white shadow-sm"
							:	"text-gray-500 hover:text-cyan-500"
						}`}
					>
						ENG
					</button>
					<button
						onClick={() => setLang("bn")}
						className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all duration-200 ${
							lang === "bn" ?
								"bg-cyan-500 text-white shadow-sm"
							:	"text-gray-500 hover:text-cyan-500"
						}`}
					>
						বাংলা
					</button>
				</div>

				<button
					className="flex items-center gap-1 text-sm font-medium text-red-600 hover:bg-gray-100 px-3 py-2 rounded transition-all active:scale-95"
					onClick={logout}
				>
					<span>{t("logout_btn")}</span>
					<span className="material-symbols-outlined text-[20px]">logout</span>
				</button>
			</div>
		</header>
	);
}
