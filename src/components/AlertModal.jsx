export default function AlertModal({ message, type = "error", onClose }) {
	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<div
					className={`h-1.5 w-full ${
						type === "info" ? "bg-cyan-400" : "bg-red-500"
					}`}
				/>

				<div className="p-6 space-y-4">
					<div className="flex items-center gap-3">
						<div
							className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
								type === "info" ? "bg-cyan-50" : "bg-red-50"
							}`}
						>
							{type === "info" ?
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={20}
									height={20}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									className="text-cyan-500"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"
									/>
								</svg>
							: type === "warning" ?
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={20}
									height={20}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									className="text-red-500"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
									/>
								</svg>
							:	<svg
									xmlns="http://www.w3.org/2000/svg"
									width={20}
									height={20}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									className="text-red-500"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							}
						</div>
						<h3
							className={`text-sm font-bold uppercase tracking-widest ${
								type === "info" ? "text-cyan-500" : "text-red-500"
							}`}
						>
							{type === "error" ?
								"Error"
							: type === "warning" ?
								"Warning"
							:	"Info"}
						</h3>
					</div>

					<p className="text-sm text-gray-700 leading-relaxed pl-1">
						{message}
					</p>

					<button
						onClick={onClose}
						className={`w-full h-11 rounded-xl text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98] ${
							type === "info" ?
								"bg-cyan-400 hover:bg-cyan-500 text-gray-900"
							:	"bg-red-500 hover:bg-red-600 text-white"
						}`}
					>
						Got it
					</button>
				</div>
			</div>
		</div>
	);
}
