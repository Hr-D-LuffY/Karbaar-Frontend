import { useState, useEffect } from "react";
import { apiFetch } from "../../api/fetch";

export default function ProductRow({
	product,
	categoryId,
	onQuantityChange,
	savedValues,
}) {
	const [productinfo, setProductInfo] = useState(null);
	const [open, setOpen] = useState(false);

	// ── Selected type/company for THIS row's current view ──
	// These are just UI state — the actual saved data lives in parent keyed by compositeKey
	const [selectedCompany, setSelectedCompany] = useState(null);
	const [selectedType, setSelectedType] = useState(null);

	useEffect(() => {
		if (!open || productinfo) return;
		const fetchProductInfo = async () => {
			try {
				const data = await apiFetch(
					`/products/options?category_id=${categoryId}&name=${product.name}`,
				);
				setProductInfo(data);

				// Auto-select first option as default
				if (data.length > 0) {
					setSelectedCompany(data[0].company_name);
					setSelectedType(data[0].type_code);
				}
			} catch (error) {
				console.error("Failed to load product info:", error);
			}
		};
		fetchProductInfo();
	}, [open]);

	const companies =
		productinfo ?
			[
				...new Map(
					productinfo.map((i) => [i.company_id, i.company_name]),
				).values(),
			]
		:	[];

	const types =
		productinfo ?
			[...new Map(productinfo.map((i) => [i.type_id, i.type_code])).values()]
		:	[];

	// ── Find the matching option for current type+company selection ──
	const currentOption = productinfo?.find(
		(i) => i.company_name === selectedCompany && i.type_code === selectedType,
	);

	// ── Composite key: productId_typeId_companyId ──
	// This is what makes each combination a SEPARATE entry in parent state
	// ✅ Include categoryId so same product name in different categories never collides
	// ✅ Must be this exact format — 4 segments
	const compositeKey =
		currentOption ?
			`${categoryId}_${product.id}_${currentOption.type_id}_${currentOption.company_id}`
		:	null;

	// ── Read saved values for THIS specific combination from parent ──
	const currentSaved = compositeKey ? savedValues?.[compositeKey] || {} : {};
	const reams = currentSaved.reams || 0;
	const sheets = currentSaved.sheets || 0;
	const price = currentSaved.price || "";

	// ── Check if ANY combo of this product has quantity (for the badge) ──
	const hasQuantity =
		savedValues ?
			Object.values(savedValues).some((v) => v.reams > 0 || v.sheets > 0)
		:	false;

	// ── Total reams across all combos of this product (for badge display) ──
	const totalReams =
		savedValues ?
			Object.values(savedValues).reduce((sum, v) => sum + (v.reams || 0), 0)
		:	0;
	const totalSheets =
		savedValues ?
			Object.values(savedValues).reduce((sum, v) => sum + (v.sheets || 0), 0)
		:	0;

	// ── When qty/price changes, store under compositeKey ──
	const handleChange = (field, value) => {
		if (!compositeKey) return; // can't store without knowing the option
		const numVal = Math.max(0, Number(value) || 0);

		onQuantityChange(compositeKey, {
			// Identity fields
			compositeKey,
			productId: product.id,
			productName: product.name,
			categoryId,
			optionId: currentOption?.id,
			company: selectedCompany,
			type: selectedType,
			// Spread existing saved values, then override changed field
			...currentSaved,
			[field]: field === "price" ? parseFloat(value) || 0 : numVal,
		});
	};

	// ── When type/company changes, just update local UI selection ──
	// The qty inputs will now show values for the newly selected combo
	const handleSelectChange = (field, value) => {
		if (field === "company") setSelectedCompany(value);
		if (field === "type") setSelectedType(value);
		// No need to call onQuantityChange here — user hasn't entered qty yet for this combo
	};

	return (
		<div className="border-b border-gray-100 last:border-0">
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
			>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-800">
						{product.name}
					</span>
					{/* Badge shows TOTAL across all combos of this product */}
					{hasQuantity && (
						<span className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
							{totalReams > 0 && `${totalReams}R`}
							{totalReams > 0 && totalSheets > 0 && " · "}
							{totalSheets > 0 && `${totalSheets}S`}
						</span>
					)}
				</div>
				<span
					className={`material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
				>
					expand_more
				</span>
			</button>

			{open && (
				<div className="bg-gray-50 px-4 pb-4 pt-2">
					{!productinfo ?
						<p className="text-xs text-gray-400 py-2">Loading options...</p>
					:	<div className="flex flex-wrap items-end gap-3">
							<div className="flex-1 min-w-[130px] space-y-1">
								<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
									Type
								</label>
								<select
									value={selectedType || ""}
									onChange={(e) => handleSelectChange("type", e.target.value)}
									className="w-full h-8 bg-white border border-gray-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
								>
									{types.map((code) => (
										<option key={code} value={code}>
											{code}
										</option>
									))}
								</select>
							</div>

							<div className="flex-1 min-w-[130px] space-y-1">
								<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
									Company
								</label>
								<select
									value={selectedCompany || ""}
									onChange={(e) =>
										handleSelectChange("company", e.target.value)
									}
									className="w-full h-8 bg-white border border-gray-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
								>
									{companies.map((name) => (
										<option key={name} value={name}>
											{name}
										</option>
									))}
								</select>
							</div>

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
					}
				</div>
			)}
		</div>
	);
}
