import { useLang } from '../../context/LangContext';

export default function HeroMetrics() {
  const { t } = useLang();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Today's Total Sale — dark card with cyan border */}
      <div className="bg-gray-950 text-white p-6 rounded-xl shadow-lg border-l-4 border-cyan-500 flex flex-col justify-between">
        <div>
          <p className="text-[13px] font-medium text-gray-400 uppercase tracking-wider font-mono">
            {t('metric_sale_label')}
          </p>
          <h2 className="text-4xl font-bold tracking-tight mt-2">৳12,450</h2>
        </div>
      </div>

      {/* Customer Dues — magenta border */}
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-fuchsia-500">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider font-mono">
            {t('metric_customer_dues')}
          </p>
          <span className="material-symbols-outlined text-fuchsia-500">person_search</span>
        </div>
        <ul className="space-y-3">
          <li className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-sm">Horizon Agency</span>
            <span className="font-mono text-sm font-bold text-red-600">৳2,300</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-semibold text-gray-800 text-sm">Apex Designs</span>
            <span className="font-mono text-sm font-bold text-red-600">৳1,850</span>
          </li>
        </ul>
      </div>

      {/* Vendor Dues — yellow border */}
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-400">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider font-mono">
            {t('metric_vendor_dues')}
          </p>
          <span className="material-symbols-outlined text-yellow-500">factory</span>
        </div>
        <ul className="space-y-3">
          <li className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-sm">Luxe Paper Co.</span>
            <span className="font-mono text-sm font-semibold text-gray-700">৳4,500</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-semibold text-gray-800 text-sm">Inker's Hub</span>
            <span className="font-mono text-sm font-semibold text-gray-700">৳3,200</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
