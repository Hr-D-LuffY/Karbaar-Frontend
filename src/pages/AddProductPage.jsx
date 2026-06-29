import { useState, useEffect } from "react";
import { useLang } from "../context/LangContext";
import { getCategories } from "../services/addproduct";
import CategoryTabs from "../components/AddProduct/CategoryTabs";
import { BottomBar, BottomBarSpacer } from "../components/AddProduct/BottomBar";
import { ProductRow, ProductList } from "../components/AddProduct/ProductRow";
import { useAlert } from "../context/AlertContext";

const DEMO_FREQUENT_CLIENTS = [
	{ id: 1, name: "ABC Printing", phone: "01711-000001" },
	{ id: 2, name: "Creative Hub", phone: "01711-000002" },
	{ id: 3, name: "Dhaka Offset", phone: "01711-000003" },
];

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
	console.log(selections);
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
	const { showAlert } = useAlert();

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

		const missingPrice = items.find((s) => !s.price || s.price <= 0);
		if (missingPrice) {
			showAlert(
				`Please enter a buying price for "${missingPrice.productName}" — ${missingPrice.type} (${missingPrice.company}) before confirming.`,
				"warning",
			);
			return;
		}

		const payload = {
			vendor: {
				clientId: vendorInfo.clientId,
				name: vendorInfo.name,
				phone: vendorInfo.phone,
			},
			payment: {
				isDue,
				advance: isDue ? advance : 0,
				dueBalance:
					isDue ?
						Math.max(
							0,
							items.reduce(
								(sum, i) =>
									sum +
									(i.reams || 0) * (i.price || 0) +
									((i.sheets || 0) / 500) * (i.price || 0),
								0,
							) - advance,
						)
					:	0,
			},
			items: items.map((i) => ({
				productId: i.productId,
				categoryId: i.categoryId,
				categoryName: i.categoryName,
				productName: i.productName,
				company: i.company,
				type: i.type,
				reams: i.reams || 0,
				sheets: i.sheets || 0,
				price: i.price,
				lineTotal:
					(i.reams || 0) * (i.price || 0) +
					((i.sheets || 0) / 500) * (i.price || 0),
			})),
		};

		console.log("payload →", payload); // replace with your API call
		// e.g. await yourApiService.createPurchaseOrder(payload);

		setShowModal(false);
		setSelections({});
		setVendorInfo({ clientId: null, name: "", phone: "" });
		setIsDue(false);
		setAdvance(0);
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
