import { useState, useEffect } from "react";
import { useLang } from "../context/LangContext";
import {
	getCategories,
	getProduct,
	getProductOptions,
} from "../services/addproduct";

const DEMO_FREQUENT_CLIENTS = [
	{ id: 1, name: "ABC Printing", phone: "01711-000001" },
	{ id: 2, name: "Creative Hub", phone: "01711-000002" },
	{ id: 3, name: "Dhaka Offset", phone: "01711-000003" },
];

function compositeKey(catId, productId, typeId, companyId) {
	return `${catId}_${productId}_${typeId}_${companyId}`;
}

function uniqueTypes(opts) {
	return [...new Map(opts.map((o) => [o.type_id, o.type_code])).values()];
}

function uniqueCompanies(opts) {
	return [...new Map(opts.map((o) => [o.company_id, o.company_name])).values()];
}

function VendorSection({ vendorInfo, onVendorChange }) {
	const { t } = useLang();
	const { clientId, name, phone } = vendorInfo;

	function handleClientSelect(e) {
		const id = Number(e.target.value);
		if (id === 0) {
			onVendorChange({ clientId: null, name: "", phone: "" });
		} else {
			const client = DEMO_FREQUENT_CLIENTS.find((c) => c.id === id);
			if (client)
				onVendorChange({
					clientId: id,
					name: client.name,
					phone: client.phone,
				});
		}
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4 mt-4 sm:mt-6">
			<div className="flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={18}
					height={18}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					className="text-gray-700 flex-shrink-0"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
				<h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">
					{t("vendor_info")}
				</h3>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
				<div className="space-y-1">
					<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
						{t("frequent_vendor")}
					</label>
					<select
						value={clientId ?? 0}
						onChange={handleClientSelect}
						className="w-full h-10 bg-gray-50 border border-gray-200 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
					>
						<option value={0}>Other vendor</option>
						{DEMO_FREQUENT_CLIENTS.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-1">
					<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
						{t("Vendor_name")}
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) =>
							onVendorChange({
								...vendorInfo,
								clientId: null,
								name: e.target.value,
							})
						}
						placeholder={t("name_place")}
						className="w-full h-10 bg-gray-50 border border-gray-200 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
					/>
				</div>

				<div className="space-y-1 sm:col-span-2">
					<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
						{t("phone_num")}
					</label>
					<input
						type="tel"
						value={phone}
						onChange={(e) =>
							onVendorChange({
								...vendorInfo,
								clientId: null,
								phone: e.target.value,
							})
						}
						placeholder="+880 1XXX XXXXXX"
						className="w-full h-10 bg-gray-50 border border-gray-200 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
					/>
				</div>
			</div>
		</div>
	);
}

function CategoryTabs({ categories, activeCategoryId, onSelect }) {
	return (
		<>
			{/* Mobile: stacked vertical list */}
			<div className="flex flex-col gap-2 mb-3 sm:hidden">
				{categories.map((cat) => {
					const active = cat.id === activeCategoryId;
					return (
						<button
							key={cat.id}
							onClick={() => onSelect(cat.id)}
							className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-left ${
								active ?
									"bg-gray-900 text-white"
								:	"bg-white border border-gray-200 text-gray-600"
							}`}
						>
							{cat.name}
						</button>
					);
				})}
			</div>

			{/* Desktop: horizontal scrollable pills */}
			<div className="hidden sm:flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-none">
				{categories.map((cat) => {
					const active = cat.id === activeCategoryId;
					return (
						<button
							key={cat.id}
							onClick={() => onSelect(cat.id)}
							className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
								active ?
									"bg-gray-900 text-white"
								:	"bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
							}`}
						>
							{cat.name}
						</button>
					);
				})}
			</div>
		</>
	);
}

function ProductRow({
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

				optionId: currentOpt.id,
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
							{/* ── Desktop layout: original flex-wrap ── */}
							<div className="hidden sm:flex flex-wrap items-end gap-3">
								<div className="flex-1 min-w-[130px] space-y-1">
									<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Type
									</label>
									<select
										value={rowSel.type}
										onChange={(e) =>
											setRowSel((s) => ({ ...s, type: e.target.value }))
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
											setRowSel((s) => ({ ...s, company: e.target.value }))
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
										defaultValue={saved.reams || 0}
										key={`${key}-reams-d`}
										onInput={(e) => handleQtyInput("reams", e.target.value)}
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
										defaultValue={saved.sheets || 0}
										key={`${key}-sheets-d`}
										onInput={(e) => handleQtyInput("sheets", e.target.value)}
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
										defaultValue={saved.price || ""}
										placeholder="0.00"
										key={`${key}-price-d`}
										onInput={(e) => handleQtyInput("price", e.target.value)}
										className="w-full h-8 border border-gray-200 rounded px-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
									/>
								</div>
							</div>

							{/* ── Mobile layout: stacked rows ── */}
							<div className="sm:hidden space-y-3">
								<div className="space-y-1">
									<label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Type
									</label>
									<select
										value={rowSel.type}
										onChange={(e) =>
											setRowSel((s) => ({ ...s, type: e.target.value }))
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
											setRowSel((s) => ({ ...s, company: e.target.value }))
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
											defaultValue={saved.reams || 0}
											key={`${key}-reams-m`}
											onInput={(e) => handleQtyInput("reams", e.target.value)}
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
											defaultValue={saved.sheets || 0}
											key={`${key}-sheets-m`}
											onInput={(e) => handleQtyInput("sheets", e.target.value)}
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
										defaultValue={saved.price || ""}
										placeholder="0.00"
										key={`${key}-price-m`}
										onInput={(e) => handleQtyInput("price", e.target.value)}
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

function ProductList({
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

function BottomBar({
	selections,
	isDue,
	setIsDue,
	advance,
	setAdvance,
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
	const grandTotal = items.reduce(
		(sum, i) =>
			sum +
			(i.reams || 0) * (i.price || 0) +
			((i.sheets || 0) / 500) * (i.price || 0),
		0,
	);
	const dueBalance = Math.max(0, grandTotal - advance);

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

					{/* Row 2: Due toggle — full width */}
					<div className="flex items-center justify-between">
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

function BottomBarSpacer({ selections, isDue, navHeight = 64 }) {
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
	const barHeight = isDue ? 200 : 148;
	const height = barHeight + (isMobile ? navHeight : 0);
	return <div style={{ height }} />;
}

function ReviewModal({
	selections,
	isDue,
	advance,
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

	const grandTotal = items.reduce(
		(sum, i) =>
			sum +
			(i.reams || 0) * (i.price || 0) +
			((i.sheets || 0) / 500) * (i.price || 0),
		0,
	);
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
													key={item.optionId}
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

export default function AddOrderPage({ navHeight = 64 }) {
	const [categories, setCategories] = useState([]);
	const [activeCategoryId, setActiveCategoryId] = useState(null);
	const [selections, setSelections] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [isDue, setIsDue] = useState(false);
	const [advance, setAdvance] = useState(0);
	const [vendorInfo, setVendorInfo] = useState({
		clientId: null,
		name: "",
		phone: "",
	});

	useEffect(() => {
		async function load() {
			try {
				const data = await getCategories();

				setCategories(data);

				if (data.length) {
					setActiveCategoryId(data[0].id);
				}
			} catch (error) {
				console.error(error);
			}
		}

		load();
	}, []);

	function handleConfirm() {
		const items = Object.values(selections).filter(
			(s) => s.reams > 0 || s.sheets > 0,
		);
		alert(
			`Submitted! ${items.length} item(s) for ${vendorInfo.name || "unknown vendor"}`,
		);
		setShowModal(false);
	}
	return (
		<div className="p-3 sm:p-4 md:p-8 max-w-5xl mx-auto">
			<CategoryTabs
				categories={categories}
				activeCategoryId={activeCategoryId}
				onSelect={setActiveCategoryId}
			/>

			<ProductList
				activeCategoryId={activeCategoryId}
				categories={categories}
				selections={selections}
				onSelectionsChange={setSelections}
			/>

			<VendorSection vendorInfo={vendorInfo} onVendorChange={setVendorInfo} />

			<BottomBarSpacer
				selections={selections}
				isDue={isDue}
				navHeight={navHeight}
			/>

			<BottomBar
				selections={selections}
				isDue={isDue}
				setIsDue={setIsDue}
				advance={advance}
				setAdvance={setAdvance}
				onOpenModal={() => setShowModal(true)}
				navHeight={navHeight}
			/>

			{showModal && (
				<ReviewModal
					selections={selections}
					isDue={isDue}
					advance={advance}
					vendorInfo={vendorInfo}
					onClose={() => setShowModal(false)}
					onConfirm={handleConfirm}
					navHeight={navHeight}
				/>
			)}
		</div>
	);
}
