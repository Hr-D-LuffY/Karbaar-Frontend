// import Header from "../components/Header";
import LoginBox from "../components/LoginBox";
// import Footer from "../components/Footer";
import logo from "../assets/KarbarLogo.png";

const LoginPage = () => {
	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			<Header />
			{/* <section className="w-full md:w-1/2 flex justify-center items-center bg-white p-8">
				<div className="text-center">
					<img
						src="../assets/hero.png"
						alt="Karbaar Logo"
						className="w-64 h-64 object-contain mx-auto"
					/>
				</div>
			</section> */}

			<main className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
				<LoginBox />

				<div className="md:hidden mt-8">
					{/* <Footer /> */}
					<div className="text-center">
						<p className="text-sm">
							Powered by
							<span className="font-bold text-cyan-700 ml-1">কারবার</span>
						</p>

						<p className="text-xs text-gray-500">
							আপনার ব্যবসার স্মার্ট সমাধান
						</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default LoginPage;
