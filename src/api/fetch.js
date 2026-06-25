const BASE_URL = "http://localhost:5000/api";

export const apiFetch = async (endpoint, options = {}) => {
	const res = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message || "Something went wrong");
	}

	return data;
};
