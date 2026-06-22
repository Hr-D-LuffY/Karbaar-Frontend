import { useState } from "react";

const LoginBox = () => {
	const [identity, setIdentity] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();

		setLoading(true);

		setTimeout(() => {
			alert("Login Successful!");
			setLoading(false);
		}, 1500);
	};

	return (
		<div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
			<div className="h-1 bg-cyan-700"></div>

			<div className="p-8">
				<h2 className="text-3xl font-bold mb-1">Welcome Back</h2>

				<p className="text-gray-500 mb-8">
					Please enter your credentials to access the shop portal.
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Username */}

					<div>
						<label className="block mb-2">Username or Email</label>

						<input
							type="text"
							value={identity}
							onChange={(e) => setIdentity(e.target.value)}
							placeholder="Enter operator ID"
							className="w-full border rounded-lg p-3"
						/>
					</div>

					{/* Password */}

					<div>
						<label className="block mb-2">Password</label>

						<div className="border rounded-lg flex items-center">
							<input
								type={showPass ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="flex-1 p-3 outline-none"
							/>

							<button
								type="button"
								onClick={() => setShowPass(!showPass)}
								className="px-4"
							>
								{showPass ? "🙈" : "👁"}
							</button>
						</div>
					</div>

					{/* Remember */}

					<div className="flex justify-between">
						<label className="flex gap-2">
							<input type="checkbox" />
							Remember Me
						</label>

						<a href="#" className="text-cyan-700">
							Forgot Password?
						</a>
					</div>

					{/* Button */}

					<button
						disabled={loading}
						className="w-full bg-cyan-700 text-white py-4 rounded-lg"
					>
						{loading ? "AUTHENTICATING..." : "SIGN IN"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginBox;
