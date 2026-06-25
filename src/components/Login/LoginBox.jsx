import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore.js";

const IconPerson = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#45464d"
		strokeWidth="1.8"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="12" cy="8" r="4" />
		<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
	</svg>
);

const IconLock = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#45464d"
		strokeWidth="1.8"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="3" y="11" width="18" height="11" rx="2" />
		<path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</svg>
);

const IconEye = ({ off }) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.8"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		{off ?
			<>
				<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
				<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
				<line x1="1" y1="1" x2="23" y2="23" />
			</>
		:	<>
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
				<circle cx="12" cy="12" r="3" />
			</>
		}
	</svg>
);

const IconArrow = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="5" y1="12" x2="19" y2="12" />
		<polyline points="12 5 19 12 12 19" />
	</svg>
);

const IconCheck = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="white"
		strokeWidth="3.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

const IconSpinner = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		className="spin"
	>
		<circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
		<path d="M12 2a10 10 0 0 1 10 10" />
	</svg>
);

const IconVerified = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		<polyline points="9 12 11 14 15 10" />
	</svg>
);

export default function LoginBox() {
	const [identifier, setIdentifier] = useState(""); // ✅ fixed
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false); // ✅ fixed
	const [showPassword, setShowPassword] = useState(false); // ✅ fixed
	const [error, setError] = useState("");
	const [status, setStatus] = useState("idle");

	const login = useAuthStore((state) => state.login);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setStatus("loading");

		try {
			await login(identifier, password, rememberMe);
			setStatus("success");
			setTimeout(() => navigate("/dashboard"), 1000);
		} catch (err) {
			setError(err.message);
			setStatus("idle");
		}
	};

	const btnClass =
		status === "idle" ?
			"btn-teal btn-shadow-teal cursor-pointer active:scale-95"
		: status === "loading" ? "btn-teal-dark cursor-not-allowed"
		: "btn-green btn-shadow-green cursor-not-allowed";

	const btnContent = {
		idle: (
			<>
				<span className="tracking-widest text-sm font-bold">SIGN IN</span>
				<IconArrow />
			</>
		),
		loading: (
			<>
				<IconSpinner />
				<span className="tracking-widest text-sm font-bold">
					AUTHENTICATING…
				</span>
			</>
		),
		success: (
			<>
				<IconVerified />
				<span className="tracking-widest text-sm font-bold">
					ACCESS GRANTED
				</span>
			</>
		),
	};

	return (
		<div className="w-full bg-white rounded-2xl overflow-hidden card-shadow">
			{/* Teal accent bar */}
			<div className="accent-bar h-1.5 w-full" />

			<div className="p-4 sm:p-6 md:p-8">
				{/* Heading */}
				<div className="mb-5">
					<h2 className="text-ink text-2xl sm:text-3xl font-extrabold leading-tight">
						Welcome Back
					</h2>
					<p className="text-muted mt-1 text-sm font-medium">
						Please enter your credentials to access the portal.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-2">
						<label
							htmlFor="identity"
							className="block text-xs font-semibold text-ink tracking-wide font-mono"
						>
							Email or Phone Number
						</label>
						<div className="input-wrap flex items-center gap-2 px-2">
							<span className="shrink-0">
								<IconPerson />
							</span>
							<input
								id="identity"
								type="text"
								value={identifier} // ✅ fixed
								onChange={(e) => setIdentifier(e.target.value)} // ✅ fixed
								placeholder="Enter Email or Phone Number"
								className="flex-1 min-w-0 py-3.5 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
								style={{ color: "#020617" }}
								required
								autoComplete="username"
							/>
						</div>
					</div>

					{/* Password field */}
					<div className="space-y-2">
						<label
							htmlFor="password"
							className="block text-xs font-semibold text-ink tracking-wide font-mono"
						>
							Password
						</label>
						<div className="input-wrap flex items-center gap-2 px-2">
							<span className="shrink-0">
								<IconLock />
							</span>
							<input
								id="password"
								type={showPassword ? "text" : "password"} // ✅ fixed
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="flex-1 min-w-0 py-3.5 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
								style={{ color: "#020617" }}
								required
								autoComplete="current-password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((v) => !v)} // ✅ fixed
								className="eye-btn shrink-0 p-1 bg-transparent border-none cursor-pointer flex items-center"
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								<IconEye off={showPassword} /> {/* ✅ fixed */}
							</button>
						</div>
					</div>

					{/* Remember me + Forgot */}
					<div className="flex items-center justify-between flex-wrap gap-3 pt-1">
						<label className="flex items-center gap-2.5 cursor-pointer select-none">
							<div
								onClick={() => setRememberMe((v) => !v)} // ✅ fixed
								className={`checkbox-default ${rememberMe ? "checkbox-checked" : ""}`} // ✅ fixed
							>
								{rememberMe && <IconCheck />} {/* ✅ fixed */}
							</div>
							<span className="text-sm text-muted">Remember Me</span>
						</label>
						<a href="#" className="forgot-link text-sm">
							Forgot Password?
						</a>
					</div>

					{/* Error */}
					{error && <p className="text-sm text-red-500 font-medium">{error}</p>}

					{/* Submit button */}
					<button
						type="submit"
						disabled={status !== "idle"}
						className={`mt-2 w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-white font-bold transition-all duration-200 ${btnClass}`}
					>
						{btnContent[status]}
					</button>
				</form>

				<div className="mt-5 pt-5 border-t border-gray-100" />
			</div>
		</div>
	);
}
