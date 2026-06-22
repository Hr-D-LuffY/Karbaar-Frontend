import { createContext, useContext, useState } from "react";

const translations = {
	en: {
		welcome_title: "Welcome, Hr Press",
		logout_btn: "Logout",
		main_menu_label: "Main Menu",
		nav_dashboard: "Dashboard",
		nav_inventory: "Inventory",
		nav_sales: "Sales",
		nav_customers: "Customers",
		nav_staff: "Staff",
		metric_sale_label: "Today's Total Sale",
		metric_sale_trend: "+14% from yesterday",
		metric_customer_dues: "Customer Dues",
		metric_vendor_dues: "Vendor Dues",
		quick_actions_title: "Quick Actions",
		action_add_product: "Add Product",
		action_sell_product: "Sell Product",
		action_inventory_report: "Inventory Report",
		action_sell_report: "Sell Report",
		action_buy_report: "Buy Report",
		action_due_report: "Due Report",
		action_workers_salary: "Workers Salary",
		action_printing_queue: "Printing Queue",
		recent_logs_title: "Recent Logs",
		log_1_title: "Offset Press-01 Completed",
		log_1_desc: "Job #4492 • 2500 Units",
		log_2_title: "Die Cutting Started",
		log_2_desc: "Job #4501 • Premium Matte",
		log_3_title: "Inventory Re-stock",
		log_3_desc: "Art Paper 300GSM • +50 Reams",
		footer_tagline: "আপনার ব্যবসার স্মার্ট সমাধান",
	},
	bn: {
		welcome_title: "স্বাগতম, এইচআর প্রেস",
		logout_btn: "লগআউট",
		main_menu_label: "প্রধান মেনু",
		nav_dashboard: "ড্যাশবোর্ড",
		nav_inventory: "ইনভেন্টরি",
		nav_sales: "বিক্রয়",
		nav_customers: "গ্রাহকগণ",
		nav_staff: "শ্রমিকগণ",
		metric_sale_label: "আজকের মোট বিক্রয়",
		metric_sale_trend: "গতকাল থেকে +১৪% বেশি",
		metric_customer_dues: "গ্রাহকের বকেয়া",
		metric_vendor_dues: "ভেন্ডর বকেয়া",
		quick_actions_title: "দ্রুত পদক্ষেপ",
		action_add_product: "পণ্য যোগ করুন",
		action_sell_product: "পণ্য বিক্রয়",
		action_inventory_report: "ইনভেন্টরি রিপোর্ট",
		action_sell_report: "বিক্রয় রিপোর্ট",
		action_buy_report: "ক্রয় রিপোর্ট",
		action_due_report: "বকেয়া রিপোর্ট",
		action_workers_salary: "শ্রমিক বেতন",
		action_printing_queue: "প্রিন্টিং কিউ",
		recent_logs_title: "সাম্প্রতিক লগ",
		log_1_title: "অফসেট প্রেস-০১ সম্পন্ন",
		log_1_desc: "কাজ #৪৪৯২ • ২৫০০ ইউনিট",
		log_2_title: "ডাই কাটিং শুরু হয়েছে",
		log_2_desc: "কাজ #৪৫০১ • প্রিমিয়াম ম্যাট",
		log_3_title: "ইনভেন্টরি রিস্টক",
		log_3_desc: "আর্ট পেপার ৩০০জিএসএম • +৫০ রিম",
		footer_tagline: "আপনার ব্যবসার স্মার্ট সমাধান",
	},
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
	const [lang, setLang] = useState("en");
	const t = (key) => translations[lang][key] ?? key;
	return (
		<LangContext.Provider value={{ lang, setLang, t }}>
			{children}
		</LangContext.Provider>
	);
}

export const useLang = () => useContext(LangContext);
