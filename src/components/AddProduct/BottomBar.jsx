import { useState, useEffect } from "react";

export function BottomBar({
	selections,
	isDue,
	setIsDue,
	advance,
	setAdvance,
	transportCost,
	setTransportCost,
	onOpenModal,
	navHeight = 64,
}) {
	const [isMobile, setIsMobile] = useState(
		() => typeof window !== "undefined" && window.innerWidth < 640,
	);
	useEffect(() => {
		const handler = () => setIsMobile(window.innerWidth < 640);
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);

	const items = Object.values(selections).filter(
		(s) => s.reams > 0 || s.sheets > 0,
	);
	if (items.length === 0) return null;

	const totalReams = items.reduce((s, i) => s + (i.reams || 0), 0);
	const totalSheets = items.reduce((s, i) => s + (i.sheets || 0), 0);
	const grandTotal =
		items.reduce(
			(sum, i) =>
				sum +
				(i.reams || 0) * (i.price || 0) +
				((i.sheets || 0) / 500) * (i.price || 0),
			0,
		) + (transportCost || 0);
	const dueBalance = Math.max(0, grandTotal - advance);

	const transportValue = transportCost === null ? "" : transportCost;

	function handleTransportChange(e) {
		const raw = e.target.value;
		setTransportCost(raw === "" ? null : parseFloat(raw));
	}

	return (
		<div
			className="fixed left-0 lg:left-64 right-0 bg-white border-t-2 border-gray-100 px-3 sm:px-6 md:px-8 pt-3 z-40"
			style={{
				bottom: isMobile ? navHeight : 0,
				boxShadow: "0 -4px 12px rgba(0,0,0,0.07)",
				paddingBottom: "0.75rem",
			}}
		>
			<div className="max-w-5xl mx-auto space-y-2.5">
				{/* ── MOBILE layout (hidden on sm+) ── */}
				<div className="sm:hidden space-y-2">
					{/* Row 1: Reams | divider | Sheets | divider | Total */}
					<div className="flex items-center gap-3">
						<div className="flex-1">
							<p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
								Reams
							</p>
							<p className="text-base font-semibold text-gray-900">
								{totalReams > 0 ? `${totalReams} Ream` : "—"}
							</p>
						</div>
						<div className="h-8 w-px bg-gray-200 flex-shrink-0" />
						<div className="flex-1">
							<p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
								Sheets
							</p>
							<p className="text-base font-semibold text-gray-900">
								{totalSheets > 0 ? `${totalSheets} Sheet` : "—"}
							</p>
						</div>
						<div className="h-8 w-px bg-gray-200 flex-shrink-0" />
						<div className="flex-1 text-right">
							<p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
								Total
							</p>
							<p className="text-base font-bold text-gray-900">
								৳
								{grandTotal.toLocaleString("en-BD", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</p>
						</div>
					</div>

					{/* Row 2: Transport + Due toggle */}
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
								Transport (৳)
							</p>
							<input
								type="number"
								min={0}
								value={transportValue}
								onChange={handleTransportChange}
								placeholder="Required"
								className={`w-24 h-8 rounded border px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
									transportCost === null ?
										"border-red-400 bg-red-50 placeholder-red-400"
									:	"border-gray-200"
								}`}
							/>
						</div>
						<label className="flex items-center gap-2 cursor-pointer select-none">
							<span className="text-xs font-bold uppercase tracking-wider text-gray-600">
								Due?
							</span>
							<input
								type="checkbox"
								checked={isDue}
								onChange={(e) => {
									setIsDue(e.target.checked);
									if (!e.target.checked) setAdvance(0);
								}}
								className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-cyan-400"
							/>
						</label>
						{isDue && (
							<div className="flex items-center gap-3">
								<div>
									<p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
										Advance (৳)
									</p>
									<input
										type="number"
										min={0}
										value={advance}
										onChange={(e) =>
											setAdvance(parseFloat(e.target.value) || 0)
										}
										className="w-24 h-8 rounded border border-gray-200 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
									/>
								</div>
								<div className="text-right">
									<p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
										Due Balance
									</p>
									<p className="text-sm font-bold text-red-500">
										৳
										{dueBalance.toLocaleString("en-BD", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* ── DESKTOP layout (hidden on mobile) ── */}
				<div className="hidden sm:block space-y-2.5">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-6 min-w-0">
							<div>
								<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
									Total Quantity
								</p>
								<p className="text-lg font-semibold text-gray-900">
									{totalReams > 0 && `${totalReams} Ream`}
									{totalReams > 0 && totalSheets > 0 && " · "}
									{totalSheets > 0 && `${totalSheets} Sheet`}
								</p>
							</div>
							<div className="h-8 w-px bg-gray-100 flex-shrink-0" />
							<div>
								<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
									Grand Total
								</p>
								<p className="text-lg font-bold text-gray-900">
									৳
									{grandTotal.toLocaleString("en-BD", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4 flex-shrink-0">
							{/* Transport cost — desktop */}
							<div className="space-y-0.5">
								<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
									Transport (৳)
								</label>
								<input
									type="number"
									min={0}
									value={transportValue}
									onChange={handleTransportChange}
									placeholder="Required"
									className={`w-24 h-9 rounded border px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
										transportCost === null ?
											"border-red-400 bg-red-50 placeholder-red-400"
										:	"border-gray-200"
									}`}
								/>
							</div>
							<label className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg cursor-pointer select-none">
								<span className="text-xs font-bold uppercase tracking-wider text-gray-600">
									Due?
								</span>
								<input
									type="checkbox"
									checked={isDue}
									onChange={(e) => {
										setIsDue(e.target.checked);
										if (!e.target.checked) setAdvance(0);
									}}
									className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-cyan-400"
								/>
							</label>
							{isDue && (
								<div className="flex items-center gap-4">
									<div className="space-y-0.5">
										<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
											Advance (৳)
										</label>
										<input
											type="number"
											min={0}
											value={advance}
											onChange={(e) =>
												setAdvance(parseFloat(e.target.value) || 0)
											}
											className="w-24 h-9 rounded border border-gray-200 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
										/>
									</div>
									<div className="space-y-0.5">
										<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
											Due Balance
										</p>
										<p className="text-sm font-bold text-red-500">
											৳
											{dueBalance.toLocaleString("en-BD", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Review button — shared */}
				<button
					onClick={onOpenModal}
					className="w-full h-11 sm:h-12 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
				>
					Review & Proceed
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={18}
						height={18}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}

export function BottomBarSpacer({ selections, isDue, navHeight = 64 }) {
	const [isMobile, setIsMobile] = useState(
		() => typeof window !== "undefined" && window.innerWidth < 640,
	);
	useEffect(() => {
		const handler = () => setIsMobile(window.innerWidth < 640);
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);
	const hasItems = Object.values(selections).some(
		(s) => s.reams > 0 || s.sheets > 0,
	);
	if (!hasItems) return null;
	const barHeight = isDue ? 200 : 160;
	const height = barHeight + (isMobile ? navHeight : 0);
	return <div style={{ height }} />;
}
