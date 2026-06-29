export default function CategoryTabs({
	categories,
	activeCategoryId,
	onSelect,
}) {
	return (
		<>
			{/* Mobile: stacked vertical list */}
			<div className="flex flex-col gap-2 mb-3 sm:hidden">
				{categories.map((cat) => {
					const active = cat.id === activeCategoryId;
					return (
						<button
							key={cat.id}
							onClick={() => onSelect(cat.id)}
							className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-left ${
								active ?
									"bg-gray-900 text-white"
								:	"bg-white border border-gray-200 text-gray-600"
							}`}
						>
							{cat.name}
						</button>
					);
				})}
			</div>

			{/* Desktop: horizontal scrollable pills */}
			<div className="hidden sm:flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-none">
				{categories.map((cat) => {
					const active = cat.id === activeCategoryId;
					return (
						<button
							key={cat.id}
							onClick={() => onSelect(cat.id)}
							className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
								active ?
									"bg-gray-900 text-white"
								:	"bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
							}`}
						>
							{cat.name}
						</button>
					);
				})}
			</div>
		</>
	);
}
