import { apiFetch } from "../api/fetch";

export const getCategories = () => apiFetch("/categories");

export const getProduct = (activeCategoryId) =>
	apiFetch(`/products?category_id=${activeCategoryId}`);

export const getProductOptions = (activeCategoryId, product_name) =>
	apiFetch(
		`/products/options?category_id=${activeCategoryId}&name=${product_name}`,
	);
