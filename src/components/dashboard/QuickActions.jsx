import { useLang } from "../../context/LangContext";
import { Link } from "react-router-dom";

const actions = [
	{
		key: "action_add_product",
		icon: "add_box",
		link: "/add-product",
		hoverClass: "hover:bg-cyan-500 hover:text-white",
	},
	{
		key: "action_sell_product",
		icon: "shopping_cart",
		link: "/addd-product",
		hoverClass: "hover:bg-cyan-500 hover:text-white",
	},
	{
		key: "action_inventory_report",
		icon: "inventory",
		link: "#",
		hoverClass: "hover:bg-gray-950 hover:text-white",
	},
	{
		key: "action_sell_report",
		icon: "analytics",
		link: "#",
		hoverClass: "hover:bg-cyan-100 hover:text-cyan-800",
	},
	{
		key: "action_buy_report",
		icon: "receipt",
		link: "#",
		hoverClass: "hover:bg-cyan-100 hover:text-cyan-800",
	},
	{
		key: "action_due_report",
		icon: "payments",
		link: "#",
		hoverClass: "hover:bg-fuchsia-500 hover:text-white",
	},
	{
		key: "action_workers_salary",
		icon: "engineering",
		link: "#",
		hoverClass: "hover:bg-yellow-400 hover:text-gray-900",
	},
	{
		key: "action_printing_queue",
		icon: "print_connect",
		link: "#",
		hoverClass: "hover:bg-cyan-500 hover:text-white",
	},
];

export default function QuickActions() {
	const { t } = useLang();

	return (
		<section>
			{/* Section heading */}
			<div className="mb-6 flex items-center gap-3">
				<span className="w-2 h-6 bg-gray-900 inline-block" />
				<h3 className="text-2xl font-semibold text-gray-900">
					{t("quick_actions_title")}
				</h3>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
				{actions.map((action) => (
					<Link
						key={action.key}
						to={action.link}
						className={`
              group bg-gray-50 p-6 rounded
              flex flex-col items-center justify-center gap-3
              shadow-sm border border-gray-200/50
              transition-all duration-200 active:scale-95
              ${action.hoverClass}
            `}
					>
						<span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-200">
							{action.icon}
						</span>
						<span className="text-[13px] font-bold uppercase tracking-wide text-center leading-tight">
							{t(action.key)}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
