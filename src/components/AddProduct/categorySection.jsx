import ProductRow from "./ProductRow";

export default function CategorySection({
	category,
	products,
	onQuantityChange,
}) {
	return (
		<section
			className={`bg-white shadow-sm border border-gray-100 border-l-4 border-l-cyan-500 rounded-lg overflow-hidden min-h-[280px]`}
		>
			<div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
				<h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">
					{category.name} Stock
				</h3>
			</div>

			<div>
				{products.map((product) => (
					<ProductRow
						key={product.id}
						product={product}
						onQuantityChange={onQuantityChange}
					/>
				))}
			</div>
		</section>
	);
}
