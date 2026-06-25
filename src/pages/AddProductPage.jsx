import { useState, useCallback, useEffect } from "react";
import { apiFetch } from "../api/fetch";

import CategorySection from "../components/AddProduct/categorySection";
import ProductRow from "../components/AddProduct/ProductRow";

export default function AddProduct() {
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);

	const [activeCategoryId, setActiveCategoryId] = useState(null);
	const [isDue, setIsDue] = useState(false);
	const [advance, setAdvance] = useState(0);

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const data = await apiFetch("/categories");

				setCategories(data);

				if (data.length > 0) {
					setActiveCategoryId(data[0].id);
				}
			} catch (error) {
				console.error("Failed to load categories:", error);
			}
		};

		loadCategories();
	}, []);

	useEffect(() => {
		if (!activeCategoryId) return;

		const loadProducts = async () => {
			try {
				console.log("Fetching products for category:", activeCategoryId);
				const data = await apiFetch(
					`/products?category_id=${activeCategoryId}`,
				);

				setProducts(data);
			} catch (error) {
				console.error("Failed to load products:", error);
			}
		};

		loadProducts();
	}, [activeCategoryId]);

	// productQuantities: { [productId]: { reams, sheets, price } }
	const [productQuantities, setProductQuantities] = useState({});

	const handleQuantityChange = useCallback((productId, values) => {
		setProductQuantities((prev) => ({
			...prev,
			[productId]: values,
		}));
	}, []);

	// Totals — sum across ALL products across ALL categories
	const totals = Object.values(productQuantities).reduce(
		(acc, { reams, sheets, price, reams: r, sheets: s }) => {
			acc.reams += reams || 0;
			acc.sheets += sheets || 0;
			acc.amount +=
				(reams || 0) * (price || 0) + (sheets || 0) * ((price || 0) / 500);
			return acc;
		},
		{ reams: 0, sheets: 0, amount: 0 },
	);

	// Recalculate correctly: price per ream, sheets are fractions of a ream (500 sheets = 1 ream)
	const grandTotal = Object.values(productQuantities).reduce(
		(sum, { reams, sheets, price }) => {
			const reamsVal = reams || 0;
			const sheetsVal = sheets || 0;
			const priceVal = price || 0;
			return sum + reamsVal * priceVal + (sheetsVal / 500) * priceVal;
		},
		0,
	);

	const dueBalance = Math.max(0, grandTotal - advance);
	const hasAnyQuantity = totals.reams > 0 || totals.sheets > 0;

	const activeCategory = categories.find((c) => c.id === activeCategoryId);
	// const products = DEMO_PRODUCTS[activeCategoryId] || [];

	return (
		<div className=" min-h-screen bg-gray-50 pb-52">
			<div className=" md:px-8 py-6 max-w-5xl  space-y-6">
				{/* ── Category Tabs ── */}
				<div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
					{categories.map((cat) => {
						const isActive = cat.id === activeCategoryId;
						return (
							<button
								key={cat.id}
								onClick={() => setActiveCategoryId(cat.id)}
								className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border ${
									isActive ?
										"bg-gray-900 text-white border-transparent"
									:	"bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
								}`}
							>
								{cat.name}
							</button>
						);
					})}
				</div>

				{/* ── Active Category Section ── */}
				{activeCategory && (
					<CategorySection
						category={activeCategory}
						products={products}
						onQuantityChange={handleQuantityChange}
					/>
				)}
			</div>

			{/* ── Fixed Bottom Bar — only shown when something is selected ── */}
			{hasAnyQuantity && (
				<div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t-2 border-gray-100 px-4 md:px-8 py-4 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.07)]">
					<div className="max-w-5xl mx-auto space-y-3">
						{/* Stats + Payment */}
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							{/* Totals */}
							<div className="flex items-center gap-6">
								<div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Total Quantity
									</p>
									<p className="text-xl font-semibold text-gray-900">
										{totals.reams > 0 &&
											`${totals.reams} Ream${totals.reams !== 1 ? "s" : ""}`}
										{totals.reams > 0 && totals.sheets > 0 && ", "}
										{totals.sheets > 0 &&
											`${totals.sheets} Sheet${totals.sheets !== 1 ? "s" : ""}`}
									</p>
								</div>
								<div className="h-10 w-px bg-gray-100" />
								<div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
										Grand Total
									</p>
									<p className="text-xl font-bold text-gray-900">
										৳{" "}
										{grandTotal.toLocaleString("en-BD", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</p>
								</div>
							</div>

							{/* Due toggle + fields */}
							<div className="flex flex-wrap items-center gap-4">
								<label className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg cursor-pointer select-none">
									<span className="text-xs font-bold uppercase tracking-wider text-gray-600">
										Due?
									</span>
									<input
										type="checkbox"
										checked={isDue}
										onChange={(e) => setIsDue(e.target.checked)}
										className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-cyan-400"
									/>
								</label>

								{isDue && (
									<div className="flex items-center gap-4">
										<div className="space-y-1">
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
										<div className="space-y-1">
											<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
												Due Balance
											</p>
											<p className="text-sm font-bold text-red-500">
												৳{" "}
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

						{/* Proceed */}
						<button className="w-full h-12 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
							Proceed
							<span className="material-symbols-outlined text-[20px]">
								chevron_right
							</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
