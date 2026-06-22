export default function SplashScreen({ visible }) {
	return (
		<div
			className={`fixed inset-0 z-[9999] bg-[#f7f9fb] flex flex-col items-center justify-center
        transition-opacity duration-500
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
		>
			{/* Ambient cyan glow */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-cyan-400 rounded-full blur-[120px] opacity-10" />
				<div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-slate-700 rounded-full blur-[100px] opacity-10" />
			</div>

			{/* Center content */}
			<div className="relative z-10 flex flex-col items-center justify-between h-full py-24 w-full max-w-lg px-4">
				{/* Spacer */}
				<div />

				{/* Logo + loader */}
				<div className="flex flex-col items-center">
					<div className="w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
						<img
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE8FksfKY5B__Q1CtVvC9wbZDDGC2_rQlM3wqtFTIwJeoldqEz0xPGepyI-9J-w-du9AL8A5dcMtfzDrckBzl37FH_6ONmO1Lh0mnjluaTjUGTqANdIZRUJxBbYYEXboNSAGQHlIPLLcujU0qfAA21aRpwa17lP3B-fH1InQAoI46s9dA0LCzJaWGFIteAPpPQBx7K4YnCfMA9cJAJr86AYyiLBCmFHRiNKgrb7a9B1MPtnapEHFTvN7hCBilvjC9fbTWxvR0qoXLZ"
							alt="Hr Press Logo"
							className="max-w-full max-h-full object-contain"
						/>
					</div>

					{/* Loading bar */}
					<div className="mt-10 w-48 h-1 bg-gray-200 rounded-full overflow-hidden relative">
						<div className="absolute inset-0 w-full h-full bg-cyan-500 rounded-full animate-[industrialProgress_2s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
					</div>

					{/* Status text */}
					<div className="mt-4 flex items-center gap-2 text-gray-400">
						<span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
						<span className="text-[11px] font-medium tracking-widest uppercase font-mono">
							Initializing Systems...
						</span>
					</div>
				</div>

				{/* Bottom branding */}
				<div className="text-center">
					<p className="text-xl font-semibold text-gray-700 opacity-80">
						আপনার ব্যবসার স্মার্ট সমাধান
					</p>
					<div className="mt-4 flex items-center justify-center gap-3 text-gray-400">
						<span className="text-xs tracking-widest opacity-60">
							EST. 2026
						</span>
						<span className="w-1 h-1 rounded-full bg-gray-300" />
					</div>
				</div>
			</div>
		</div>
	);
}
