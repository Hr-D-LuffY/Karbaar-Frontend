import logo from "../assets/KarbarLogo.png";

export default function Header() {
	return (
		<section className="w-full md:w-1/2 flex justify-center items-center bg-white p-8">
			<div className="text-center">
				<img
					src={logo}
					alt="Karbaar Logo"
					className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto"
				/>
			</div>
		</section>
	);
}
