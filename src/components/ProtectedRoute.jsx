import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore.js";

const ProtectedRoute = ({ children }) => {
	const user = useAuthStore((state) => state.user);
	const loading = useAuthStore((state) => state.loading);

	if (loading) return <div>Loading...</div>;
	if (!user) return <Navigate to="/login" />;

	return children;
};

export default ProtectedRoute;
