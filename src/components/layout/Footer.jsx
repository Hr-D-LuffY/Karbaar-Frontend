import { useLang } from "../../context/LangContext";

export default function Footer() {
	const { t } = useLang();

	return (
		<footer className="mt-auto py-8 bg-white border-t border-gray-100">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4 md:px-8">
				{/* Left: কারবার wordmark + divider + tagline */}
				<div className="flex items-center gap-4">
					<span className="text-2xl font-bold text-cyan-500 tracking-tight">
						কারবার
					</span>
					<div className="hidden md:block h-8 w-px bg-gray-200" />
					<p className="text-xs text-gray-400 italic max-w-[200px]">
						{t("footer_tagline")}
					</p>
				</div>

				{/* Right: contact info */}
				<div className="flex flex-wrap justify-center md:justify-end items-center gap-x-8 gap-y-3 text-gray-500">
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-[18px]">call</span>
						<span className="text-sm">+880 15339 61467 </span>
					</div>
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-[18px]">mail</span>
						<span className="text-sm">hrsiam420@gmail.com</span>
					</div>
				</div>
			</div>

			{/* Powered by — centered */}
			<div className="mt-6 pt-4 border-t border-gray-50 flex justify-center items-center gap-1.5">
				<span className="text-[10px] uppercase tracking-widest text-gray-300">
					Powered by
				</span>
				<span className="text-[11px] font-bold tracking-tighter text-gray-400">
					KARBAAR
				</span>
			</div>
		</footer>
	);
}
