import { useState, useEffect } from 'react';
import { useLang } from '../../context/LangContext';

export default function SubHeader() {
  const { t } = useLang();
  const [datetime, setDatetime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setDatetime(formatted);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lg:ml-64 bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
        <h1 className="text-2xl font-semibold text-gray-900">{t('welcome_title')}</h1>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <span className="material-symbols-outlined text-[18px]">schedule</span>
        <p className="text-sm font-medium font-mono">{datetime}</p>
      </div>
    </div>
  );
}
