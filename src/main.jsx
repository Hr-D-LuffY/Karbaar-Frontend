import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LangProvider } from "./context/LangContext";
import { AlertProvider } from "./context/AlertContext";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<LangProvider>
			<AlertProvider>
				<App />
			</AlertProvider>
		</LangProvider>
	</StrictMode>,
);
