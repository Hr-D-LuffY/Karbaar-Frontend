import { useLang } from "../../context/LangContext";

export default function TopAppBar() {
	const { lang, setLang, t } = useLang();

	return (
		<header className="bg-white border-b-2 border-gray-200 shadow-sm flex justify-between items-center w-full px-4 md:px-8 py-3 sticky top-0 z-50">
			{/* Left: Logo + Name */}
			<div className="flex items-center gap-3">
				<img
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZA0joSmev4xW8dUx4nUN4jkfUxdxRXwQrnugR_NiW1rwYBKL6qSDXtd3c_QgR9mJuD2mD5cdDO1F5v30SwZGmoVblcUhDU3tW-fx9JWTOwNNT9szi8lUO9uAsEz7sp8zDagozc5cX1SRJR6yUuuIHZZQfzneBaulHQZ3FveJWvD1t0eF-HB5wM5UWzPP2YeEBExGxa4ZtGmfJGIEyMaqQ5Z4-XqcA-GnrhAyEL6mMTueXCuC2cxHpii5Hcl8f5Ar9aTou5v_vfQG8"
					alt="Karbaar Logo"
					className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
				/>
			</div>

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

				<button className="flex items-center gap-1 text-sm font-medium text-red-600 hover:bg-gray-100 px-3 py-2 rounded transition-all active:scale-95">
					<span>{t("logout_btn")}</span>
					<span className="material-symbols-outlined text-[20px]">logout</span>
				</button>
			</div>
		</header>
	);
}
