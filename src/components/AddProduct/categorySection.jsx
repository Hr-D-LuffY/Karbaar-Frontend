import ProductRow from "./ProductRow";

export default function CategorySection({
	category,
	products,
	onQuantityChange,
	productQuantities,
}) {
	return (
		<section className="bg-white shadow-sm border border-gray-100 border-l-4 border-l-cyan-500 rounded-lg overflow-hidden min-h-[280px]">
			<div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
				<h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">
					{category.name} Stock
				</h3>
			</div>
			<div>
				{products.map((product) => {
					// ✅ Key format is now categoryId_productId_typeId_companyId
					// Split and check BOTH categoryId and productId exactly to avoid partial matches
					const productSavedValues = Object.fromEntries(
						Object.entries(productQuantities).filter(([key]) => {
							const [cat, prod] = key.split("_");
							return cat === String(category.id) && prod === String(product.id);
						}),
					);

					return (
						<ProductRow
							key={product.id}
							product={product}
							categoryId={category.id}
							onQuantityChange={onQuantityChange}
							savedValues={productSavedValues}
						/>
					);
				})}
			</div>
		</section>
	);
}
