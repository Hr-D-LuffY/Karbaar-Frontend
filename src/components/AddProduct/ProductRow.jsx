import { useState } from "react";

export default function ProductRow({ product, onQuantityChange }) {
	const [open, setOpen] = useState(false);
	const [reams, setReams] = useState(0);
	const [sheets, setSheets] = useState(0);
	const [price, setPrice] = useState("");

	const handleChange = (field, value) => {
		const numVal = Math.max(0, Number(value) || 0);
		let nextReams = reams;
		let nextSheets = sheets;
		let nextPrice = price;

		if (field === "reams") {
			nextReams = numVal;
			setReams(numVal);
		}
		if (field === "sheets") {
			nextSheets = numVal;
			setSheets(numVal);
		}
		if (field === "price") {
			nextPrice = value;
			setPrice(value);
		}

		onQuantityChange(product.id, {
			reams: nextReams,
			sheets: nextSheets,
			price: parseFloat(nextPrice) || 0,
		});
	};

	const hasQuantity = reams > 0 || sheets > 0;

	return (
		<div className="border-b border-gray-100 last:border-0">
			{/* Accordion header */}
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
			>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-800">
						{product.name}
					</span>
					{/* Badge shows selected quantity so user sees it even when collapsed */}
					{hasQuantity && (
						<span className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
							{reams > 0 && `${reams}R`}
							{reams > 0 && sheets > 0 && " · "}
							{sheets > 0 && `${sheets}S`}
						</span>
					)}
				</div>
				<span
					className={`material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-200 ${
						open ? "rotate-180" : ""
					}`}
				>
					expand_more
				</span>
			</button>

			{/* Accordion body */}
			{open && (
				<div className="bg-gray-50 px-4 pb-4 pt-2">
					<div className="flex flex-wrap items-end gap-3">
						{/* Type */}
						<div className="flex-1 min-w-[130px] space-y-1">
							<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
								Type
							</label>
							<select className="w-full h-8 bg-white border border-gray-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400">
								<option>Double Crown (DC)</option>
								<option>Double Demy (DD)</option>
							</select>
						</div>

						{/* Company */}
						<div className="flex-1 min-w-[130px] space-y-1">
							<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
								Company
							</label>
							<select className="w-full h-8 bg-white border border-gray-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400">
								<option>Partex Paper Mills</option>
								<option>Bashundhara</option>
							</select>
						</div>

						{/* Reams — fixed w-20 */}
						<div className="w-20 flex-shrink-0 space-y-1">
							<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
								Reams
							</label>
							<input
								type="number"
								min={0}
								value={reams}
								onChange={(e) => handleChange("reams", e.target.value)}
								className="w-full h-8 border border-gray-200 rounded px-1 text-center text-sm font-bold bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
							/>
						</div>

						{/* Sheets — fixed w-20 */}
						<div className="w-20 flex-shrink-0 space-y-1">
							<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
								Sheets
							</label>
							<input
								type="number"
								min={0}
								value={sheets}
								onChange={(e) => handleChange("sheets", e.target.value)}
								className="w-full h-8 border border-gray-200 rounded px-1 text-center text-sm font-bold bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
							/>
						</div>

						{/* Price — fixed w-28 */}
						<div className="w-28 flex-shrink-0 space-y-1">
							<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
								Price (৳)
							</label>
							<input
								type="number"
								min={0}
								value={price}
								placeholder="0.00"
								onChange={(e) => handleChange("price", e.target.value)}
								className="w-full h-8 border border-gray-200 rounded px-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
