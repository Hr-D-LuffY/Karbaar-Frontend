import { useState, useEffect } from "react";
import { getProduct, getProductOptions } from "../../services/addproduct";

function uniqueTypes(opts) {
	return [...new Map(opts.map((o) => [o.type_id, o.type_code])).values()];
}

function uniqueCompanies(opts) {
	return [...new Map(opts.map((o) => [o.company_id, o.company_name])).values()];
}

export function ProductRow({
	product,
	activeCategoryId,
	categoryName,
	selections,
	onSelectionsChange,
}) {
	const [open, setOpen] = useState(false);
	const [opts, setOpts] = useState(null);
	const [rowSel, setRowSel] = useState({ type: "", company: "" });

	async function handleToggle() {
		if (!open && opts === null) {
			try {
				const fetched = await getProductOptions(activeCategoryId, product.name);
				setOpts(fetched);
				if (fetched.length > 0) {
					setRowSel({
						type: fetched[0].type_code,
						company: fetched[0].company_name,
					});
				}
			} catch (error) {
				console.error(error);
			}
		}
		setOpen((v) => !v);
	}

	const currentOpt =
		opts ?
			opts.find(
				(o) => o.type_code === rowSel.type && o.company_name === rowSel.company,
			) || null
		:	null;

	const key = currentOpt?.id;
	const saved = key ? selections[key] || {} : {};

	const allVariants = Object.values(selections).filter(
		(item) =>
			item.categoryId === activeCategoryId && item.productName === product.name,
	);

	const totalReams = allVariants.reduce(
		(sum, item) => sum + (item.reams || 0),
		0,
	);
	const totalSheets = allVariants.reduce(
		(sum, item) => sum + (item.sheets || 0),
		0,
	);
	const hasAny = totalReams > 0 || totalSheets > 0;

	function handleDropdownChange(field, newValue) {
		const oldOpt = currentOpt;
		setRowSel((s) => ({ ...s, [field]: newValue }));
		if (oldOpt?.id) {
			onSelectionsChange((prev) => {
				const next = { ...prev };
				delete next[oldOpt.id];
				return next;
			});
		}
	}

	function handleQtyInput(field, rawValue) {
		if (!currentOpt || !key) return;
		const val =
			field === "price" ?
				parseFloat(rawValue) || 0
			:	Math.max(0, parseInt(rawValue) || 0);

		onSelectionsChange((prev) => ({
			...prev,
			[key]: {
				...(prev[key] || {}),
				productId: currentOpt.id,
				categoryId: activeCategoryId,
				categoryName,
				productName: product.name,
				company: currentOpt.company_name,
				type: currentOpt.type_code,
				[field]: val,
			},
		}));
	}

	const types = opts ? uniqueTypes(opts) : [];
	const companies = opts ? uniqueCompanies(opts) : [];

	return (
		<div className="border-b border-gray-100 last:border-0">
			<button
				onClick={handleToggle}
				className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
			>
				<div className="flex items-center gap-2 min-w-0">
					<span className="text-sm font-semibold text-gray-800 truncate">
						{product.name}
					</span>
					{hasAny && (
						<span className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full flex-shrink-0">
							{totalReams > 0 && `${totalReams}R`}
							{totalReams > 0 && totalSheets > 0 && " · "}
							{totalSheets > 0 && `${totalSheets}S`}
						</span>
					)}
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={18}
					height={18}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					className={`text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{open && (
				<div className="bg-gray-50 px-3 sm:px-4 pb-4 pt-2">
					{!opts ?
						<p className="text-xs text-gray-400 py-2">Loading options...</p>
					:	<>
							{/* ── Desktop layout ── */}
							<div className="hidden sm:flex flex-wrap items-end gap-3">
								<div className="flex-1 min-w-[130px] space-y-1">
									<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Type
									</label>
									<select
										value={rowSel.type}
										onChange={(e) =>
											handleDropdownChange("type", e.target.value)
										}
										className="w-full h-8 bg-white border border-gray-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
									>
										{types.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
								</div>
								<div className="flex-1 min-w-[130px] space-y-1">
									<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Company
									</label>
									<select
										value={rowSel.company}
										onChange={(e) =>
											handleDropdownChange("company", e.target.value)
										}
										className="w-full h-8 bg-white border border-gray-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
									>
										{companies.map((c) => (
											<option key={c} value={c}>
												{c}
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
										value={saved.reams ?? 0}
										onChange={(e) => handleQtyInput("reams", e.target.value)}
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
										value={saved.sheets ?? 0}
										onChange={(e) => handleQtyInput("sheets", e.target.value)}
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
										value={saved.price ?? ""}
										placeholder="0.00"
										onChange={(e) => handleQtyInput("price", e.target.value)}
										className="w-full h-8 border border-gray-200 rounded px-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
									/>
								</div>
							</div>

							{/* ── Mobile layout ── */}
							<div className="sm:hidden space-y-3">
								<div className="space-y-1">
									<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Type
									</label>
									<select
										value={rowSel.type}
										onChange={(e) =>
											handleDropdownChange("type", e.target.value)
										}
										className="w-full h-10 bg-white border border-gray-200 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
									>
										{types.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
								</div>
								<div className="space-y-1">
									<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Company
									</label>
									<select
										value={rowSel.company}
										onChange={(e) =>
											handleDropdownChange("company", e.target.value)
										}
										className="w-full h-10 bg-white border border-gray-200 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
									>
										{companies.map((c) => (
											<option key={c} value={c}>
												{c}
											</option>
										))}
									</select>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1">
										<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
											Reams
										</label>
										<input
											type="number"
											min={0}
											value={saved.reams ?? 0}
											onChange={(e) => handleQtyInput("reams", e.target.value)}
											className="w-full h-10 border border-gray-200 rounded px-3 text-center text-sm font-bold bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
										/>
									</div>
									<div className="space-y-1">
										<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
											Sheets
										</label>
										<input
											type="number"
											min={0}
											value={saved.sheets ?? 0}
											onChange={(e) => handleQtyInput("sheets", e.target.value)}
											className="w-full h-10 border border-gray-200 rounded px-3 text-center text-sm font-bold bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
										/>
									</div>
								</div>
								<div className="space-y-1">
									<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Price (৳)
									</label>
									<input
										type="number"
										min={0}
										value={saved.price ?? ""}
										placeholder="0.00"
										onChange={(e) => handleQtyInput("price", e.target.value)}
										className="w-full h-10 border border-gray-200 rounded px-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
									/>
								</div>
							</div>
						</>
					}
				</div>
			)}
		</div>
	);
}

export function ProductList({
	activeCategoryId,
	categories,
	selections,
	onSelectionsChange,
}) {
	const cat = categories.find((c) => c.id === activeCategoryId);

	const [productlist, setproductlist] = useState([]);

	useEffect(() => {
		if (activeCategoryId == null) return;
		async function load() {
			try {
				const data = await getProduct(activeCategoryId);

				setproductlist(data);
			} catch (error) {
				console.error(error);
			}
		}

		load();
	}, [activeCategoryId]);
	const products = productlist;

	return (
		<section className="bg-white shadow-sm border border-gray-100 border-l-4 border-l-cyan-500 rounded-lg overflow-hidden min-h-[240px] sm:min-h-[280px]">
			<div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
				<h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">
					{cat?.name} Stock
				</h3>
			</div>
			<div>
				{products.length === 0 ?
					<p className="px-4 py-8 text-center text-sm text-gray-400">
						No products found.
					</p>
				:	products.map((p) => (
						<ProductRow
							key={p.name}
							product={p}
							activeCategoryId={activeCategoryId}
							categoryName={cat?.name || ""}
							selections={selections}
							onSelectionsChange={onSelectionsChange}
						/>
					))
				}
			</div>
		</section>
	);
}
