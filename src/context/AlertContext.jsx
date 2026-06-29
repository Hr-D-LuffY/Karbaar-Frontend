import { createContext, useContext, useState } from "react";
import AlertModal from "../components/AlertModal";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
	const [alert, setAlert] = useState({
		open: false,
		message: "",
		type: "error",
	});

	function showAlert(message, type = "error") {
		setAlert({ open: true, message, type });
	}

	function closeAlert() {
		setAlert({ open: false, message: "", type: "error" });
	}

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}
			{alert.open && (
				<AlertModal
					message={alert.message}
					type={alert.type}
					onClose={closeAlert}
				/>
			)}
		</AlertContext.Provider>
	);
}

export function useAlert() {
	return useContext(AlertContext);
}
