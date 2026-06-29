import { useState, useEffect } from "react";
import { useLang } from "../context/LangContext";
import { getCategories } from "../services/addproduct";
import CategoryTabs from "../components/AddProduct/CategoryTabs";
import { BottomBar, BottomBarSpacer } from "../components/AddProduct/BottomBar";
import { ProductRow, ProductList } from "../components/AddProduct/ProductRow";
import ReviewModal from "../components/AddProduct/ReviewModal";
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

export default function AddOrderPage({ navHeight = 64 }) {
	const [categories, setCategories] = useState([]);
	const [activeCategoryId, setActiveCategoryId] = useState(null);
	const [selections, setSelections] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [isDue, setIsDue] = useState(false);
	const [advance, setAdvance] = useState(0);
	const [transportCost, setTransportCost] = useState(null);
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

		if (transportCost === null || transportCost === "") {
			showAlert(
				"Please enter a transport cost (enter 0 if there is none).",
				"warning",
			);
			return;
		}

		const missingPrice = items.find((s) => !s.price || s.price <= 0);
		if (missingPrice) {
			showAlert(
				`Please enter a buying price for "${missingPrice.productName}" — ${missingPrice.type} (${missingPrice.company}) before confirming.`,
				"warning",
			);
			return;
		}

		const itemsSubtotal = items.reduce(
			(sum, i) =>
				sum +
				(i.reams || 0) * (i.price || 0) +
				((i.sheets || 0) / 500) * (i.price || 0),
			0,
		);
		const grandTotal = itemsSubtotal + (transportCost || 0);

		const payload = {
			vendor: {
				clientId: vendorInfo.clientId,
				name: vendorInfo.name,
				phone: vendorInfo.phone,
			},
			payment: {
				isDue,
				transportCost: transportCost || 0,
				advance: isDue ? advance : 0,
				grandTotal, // already includes transport
				dueBalance: isDue ? Math.max(0, grandTotal - advance) : 0,
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
		setTransportCost(0);
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
				transportCost={transportCost ?? ""}
				setTransportCost={setTransportCost}
				onOpenModal={() => setShowModal(true)}
				navHeight={navHeight}
			/>

			{showModal && (
				<ReviewModal
					selections={selections}
					isDue={isDue}
					advance={advance}
					transportCost={transportCost ?? ""}
					vendorInfo={vendorInfo}
					onClose={() => setShowModal(false)}
					onConfirm={handleConfirm}
					navHeight={navHeight}
				/>
			)}
		</div>
	);
}
