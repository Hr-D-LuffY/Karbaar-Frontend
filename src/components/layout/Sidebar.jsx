import { NavLink } from "react-router-dom";
import { useLang } from "../../context/LangContext";

const navItems = [
	{ icon: "dashboard", key: "nav_dashboard", to: "/" },
	{ icon: "inventory_2", key: "nav_inventory", to: "/inventory" },
	{ icon: "receipt_long", key: "nav_sales", to: "/sales" },
	{ icon: "group", key: "nav_customers", to: "/customers" },
	{ icon: "badge", key: "nav_staff", to: "/staff" },
];

export default function Sidebar({ mobileOpen, onClose }) {
	const { t } = useLang();

	return (
		<>
			{mobileOpen && (
				<div
					className="fixed inset-0 bg-black/40 z-30 lg:hidden"
					onClick={onClose}
				/>
			)}
			<aside
				className={`
        fixed left-0 top-0 h-full w-64 bg-gray-50 shadow-lg z-40
        flex flex-col pt-20 pb-0
        transform transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
			>
				<div className="px-6 mb-8 mt-4">
					<h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">
						{t("main_menu_label")}
					</h3>
					<div className="h-1 w-12 bg-cyan-500" />
				</div>

				<nav className="flex flex-col gap-1 px-4 flex-1">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.to === "/"}
							onClick={onClose}
							className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-r-full text-sm font-medium
                transition-all duration-200
                ${
									isActive ?
										"bg-[#00687a] text-white font-bold"
									:	"text-gray-500 hover:text-gray-900 hover:bg-gray-200"
								}
              `}
						>
							<span className="material-symbols-outlined text-[22px]">
								{item.icon}
							</span>
							<span>{t(item.key)}</span>
						</NavLink>
					))}
				</nav>
				<div class="p-5 border-t border-outline-variant">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-black rounded flex items-center justify-center text-white font-bold">
							HPP
						</div>
						<div>
							<p class="text-label-md font-bold text-primary">
								Habib Printing Press
							</p>
						</div>
					</div>
				</div>
				<div className="px-6 border-t border-gray-200 pb-8 pt-3">
					<img
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS9E1-R6S5p0mnZTwSXnRJgIkJyJUXSxH240ZOvPPA-nWUEMdjhzAcvPe-GVLpy6SudLtteMYNnUXDHdbHTrjQ2BVYNHszICFs7-j4B2Eu6UEtdpX9P85_obxi2EH0A12hsG1qh6a3VBVXx6oblTsAivqOwt0xUSW-vATdbjkS0GOX11HvaomgIwwKSKJn8yCUTgsas4E4FqqeolceL8Y-gmCEDRtixwoNbA3i1RPDjfi9vJXT1Wzpme3WEDqS-h42pfAH1U4dr-pO"
						alt="Karbaar Logo"
						className="w-full h-24 object-contain"
					/>
				</div>
			</aside>
		</>
	);
}
