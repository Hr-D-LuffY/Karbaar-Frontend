export default function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">construction</span>
      <h2 className="text-xl font-semibold text-gray-400">{title}</h2>
      <p className="text-sm text-gray-300 mt-1">Coming soon</p>
    </div>
  );
}
