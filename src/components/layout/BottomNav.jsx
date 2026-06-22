import { NavLink } from "react-router-dom";
import { useLang } from "../../context/LangContext";

const navItems = [
	{ icon: "dashboard", key: "nav_dashboard", to: "/" },
	{ icon: "inventory_2", key: "nav_inventory", to: "/inventory" },
	{ icon: "receipt_long", key: "nav_sales", to: "/sales" },
	{ icon: "group", key: "nav_customers", to: "/customers" },
	{ icon: "badge", key: "nav_staff", to: "/staff" },
];

export default function BottomNav() {
	const { t } = useLang();

	return (
		<nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl">
			{navItems.map((item) => (
				<NavLink
					key={item.to}
					to={item.to}
					end={item.to === "/"}
					className={({ isActive }) => `
            flex flex-col items-center justify-center px-2 py-1 rounded
            active:scale-90 duration-150 transition-all
            ${isActive ? "bg-[#00687a] text-white" : "text-gray-500 hover:text-[#00687a]"}
          `}
				>
					<span className="material-symbols-outlined text-[22px]">
						{item.icon}
					</span>
					<span className="text-[9px] font-medium mt-0.5">{t(item.key)}</span>
				</NavLink>
			))}
		</nav>
	);
}
