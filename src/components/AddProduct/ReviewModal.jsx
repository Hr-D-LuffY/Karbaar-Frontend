import { useState, useEffect } from "react";

export default function ReviewModal({
	selections,
	isDue,
	advance,
	transportCost,
	vendorInfo,
	onClose,
	onConfirm,
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

	const itemsSubtotal = items.reduce(
		(sum, i) =>
			sum +
			(i.reams || 0) * (i.price || 0) +
			((i.sheets || 0) / 500) * (i.price || 0),
		0,
	);
	const grandTotal = itemsSubtotal + (transportCost || 0);
	const dueBalance = isDue ? Math.max(0, grandTotal - advance) : 0;
	const totalReams = items.reduce((s, i) => s + (i.reams || 0), 0);
	const totalSheets = items.reduce((s, i) => s + (i.sheets || 0), 0);

	const groups = items.reduce((acc, item) => {
		const key = item.categoryId;
		if (!acc[key]) acc[key] = { categoryId: key, items: [] };
		acc[key].items.push(item);
		return acc;
	}, {});

	const groupAccents = ["#06B6D4", "#D946EF", "#EAB308"];
	const groupEntries = Object.values(groups);

	return (
		<div
			className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
			onClick={onClose}
			style={{ paddingBottom: 0 }}
		>
			<div
				className="bg-white shadow-2xl border border-gray-200 overflow-hidden w-full sm:max-w-lg flex flex-col"
				style={{
					borderRadius: "16px 16px 0 0",
					maxHeight: isMobile ? `calc(92dvh - ${navHeight}px)` : "92dvh",
					marginBottom: isMobile ? navHeight : 0,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Drag handle on mobile */}
				<div className="flex justify-center pt-3 pb-1 sm:hidden">
					<div className="w-10 h-1 rounded-full bg-gray-200" />
				</div>

				{/* Scrollable body */}
				<div
					className="overflow-y-auto flex-1 overscroll-contain"
					style={{ WebkitOverflowScrolling: "touch" }}
				>
					{/* Header */}
					<div className="p-5 sm:p-6 border-b-2 border-dashed border-gray-200 text-center bg-white">
						<div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-900 mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={18}
								height={18}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2.5}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gray-900">
							Order Summary
						</h3>
					</div>

					<div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
						{/* Vendor info */}
						<div className="space-y-3">
							<div className="flex items-center gap-2 pb-2 border-b border-gray-900/10">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={14}
									height={14}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									className="text-gray-900 flex-shrink-0"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 22V12h6v10"
									/>
								</svg>
								<span className="font-mono text-[11px] font-bold uppercase tracking-widest text-gray-900">
									Vendor Information
								</span>
							</div>
							<div className="grid grid-cols-2 gap-3 sm:gap-4">
								<div>
									<p className="font-mono text-[10px] text-gray-500 uppercase">
										Vendor Name
									</p>
									<p className="text-sm font-bold text-gray-900 mt-0.5 break-words">
										{vendorInfo?.name || (
											<span className="text-gray-400 font-normal">—</span>
										)}
									</p>
								</div>
								<div className="text-right">
									<p className="font-mono text-[10px] text-gray-500 uppercase">
										Phone
									</p>
									<p className="font-mono text-sm font-bold text-gray-900 mt-0.5 break-all">
										{vendorInfo?.phone || (
											<span className="text-gray-400 font-normal">—</span>
										)}
									</p>
								</div>
							</div>
						</div>

						{/* Product groups */}
						{groupEntries.map((group, gi) => {
							const accent = groupAccents[gi % groupAccents.length];
							const categoryLabel =
								group.items[0]?.categoryName || `Category ${group.categoryId}`;
							return (
								<div key={group.categoryId} className="space-y-3">
									<div
										className="flex items-center gap-2 pb-2 border-b"
										style={{ borderColor: accent + "4D" }}
									>
										<span
											className="w-2 h-2 rounded-full flex-shrink-0"
											style={{ backgroundColor: accent }}
										/>
										<span
											className="font-mono text-[11px] font-bold uppercase tracking-widest"
											style={{ color: accent }}
										>
											{categoryLabel}
										</span>
									</div>
									<div className="space-y-3">
										{group.items.map((item) => {
											const lineTotal =
												(item.reams || 0) * (item.price || 0) +
												((item.sheets || 0) / 500) * (item.price || 0);
											const qtyLabel = [
												item.reams > 0 ?
													`${item.reams} Ream${item.reams !== 1 ? "s" : ""}`
												:	"",
												item.sheets > 0 ?
													`${item.sheets} Sheet${item.sheets !== 1 ? "s" : ""}`
												:	"",
											]
												.filter(Boolean)
												.join(", ");

											return (
												<div
													key={item.productId}
													className="flex justify-between items-start gap-2"
												>
													<div className="min-w-0">
														<p className="text-sm font-bold text-gray-900 truncate">
															{item.productName}
														</p>
														<p className="text-[11px] text-gray-500 truncate">
															{item.company} • {item.type}
														</p>
													</div>
													<div className="text-right flex-shrink-0">
														<p className="font-mono text-sm font-bold">
															{qtyLabel}
														</p>
														<p className="text-[11px] text-gray-500">
															৳
															{lineTotal.toLocaleString("en-BD", {
																minimumFractionDigits: 2,
															})}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}

						{/* Totals */}
						<div className="pt-4 sm:pt-6 border-t-2 border-gray-100 space-y-2.5 sm:space-y-3">
							<div className="flex justify-between items-center text-gray-500">
								<span className="font-mono text-[11px] uppercase">
									Total Quantity
								</span>
								<span className="font-mono text-sm font-bold text-gray-900">
									{[
										totalReams > 0 ?
											`${totalReams} Ream${totalReams !== 1 ? "s" : ""}`
										:	"",
										totalSheets > 0 ?
											`${totalSheets} Sheet${totalSheets !== 1 ? "s" : ""}`
										:	"",
									]
										.filter(Boolean)
										.join(", ")}
								</span>
							</div>
							<div className="flex justify-between items-center text-gray-500">
								<span className="font-mono text-[11px] uppercase">
									Subtotal
								</span>
								<span className="font-mono text-sm">
									৳
									{grandTotal.toLocaleString("en-BD", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
							</div>
							{transportCost > 0 && (
								<div className="flex justify-between items-center text-gray-500">
									<span className="font-mono text-[11px] uppercase">
										Transport Cost
									</span>
									<span className="font-mono text-sm">
										+ ৳
										{transportCost.toLocaleString("en-BD", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								</div>
							)}
							{isDue && (
								<div className="flex justify-between items-center text-fuchsia-500">
									<span className="font-mono text-[11px] font-bold uppercase">
										Advance Paid
									</span>
									<span className="font-mono text-sm font-bold">
										− ৳
										{advance.toLocaleString("en-BD", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								</div>
							)}
							<div className="flex justify-between items-center pt-3 sm:pt-4 border-t-4 border-double border-gray-900">
								{isDue ?
									<>
										<span className="text-lg sm:text-xl font-bold uppercase text-gray-900">
											Due Balance
										</span>
										<span className="text-lg sm:text-xl font-extrabold text-red-600">
											৳
											{dueBalance.toLocaleString("en-BD", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
									</>
								:	<>
										<span className="text-lg sm:text-xl font-bold uppercase text-gray-900">
											Grand Total
										</span>
										<span className="text-lg sm:text-xl font-extrabold text-gray-900">
											৳
											{grandTotal.toLocaleString("en-BD", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
									</>
								}
							</div>
						</div>
					</div>
				</div>

				{/* Action buttons */}
				<div
					className="flex gap-3 p-3 sm:p-4 border-t border-gray-100 bg-white"
					style={{
						paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
					}}
				>
					<button
						onClick={onClose}
						className="flex-1 h-12 sm:h-14 bg-gray-900 border-2 border-gray-900 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-80 transition-all flex items-center justify-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={14}
							height={14}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
							/>
						</svg>
						Edit
					</button>
					<button
						onClick={onConfirm}
						className="flex-[2] h-12 sm:h-14 text-gray-900 text-base sm:text-lg font-black uppercase tracking-widest rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 sm:gap-3"
						style={{ backgroundColor: "#06B6D4" }}
					>
						DONE
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={20}
							height={20}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
