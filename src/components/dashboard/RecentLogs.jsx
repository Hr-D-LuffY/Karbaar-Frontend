import { useLang } from '../../context/LangContext';

const logs = [
  {
    icon: 'print',
    iconBg: 'bg-cyan-50 text-cyan-500',
    titleKey: 'log_1_title',
    descKey: 'log_1_desc',
    time: '10m ago',
  },
  {
    icon: 'content_cut',
    iconBg: 'bg-fuchsia-50 text-fuchsia-500',
    titleKey: 'log_2_title',
    descKey: 'log_2_desc',
    time: '24m ago',
  },
  {
    icon: 'inventory',
    iconBg: 'bg-yellow-50 text-yellow-500',
    titleKey: 'log_3_title',
    descKey: 'log_3_desc',
    time: '1h ago',
  },
];

export default function RecentLogs() {
  const { t } = useLang();

  return (
    <section>
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm overflow-hidden">
        <h4 className="text-2xl font-semibold text-gray-900 mb-6">{t('recent_logs_title')}</h4>

        <div className="space-y-2">
          {logs.map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors rounded"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${log.iconBg}`}>
                <span className="material-symbols-outlined text-[22px]">{log.icon}</span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm">{t(log.titleKey)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t(log.descKey)}</p>
              </div>

              {/* Time */}
              <span className="font-mono text-xs text-gray-400 shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
