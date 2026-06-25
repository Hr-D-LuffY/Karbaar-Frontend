import Header from "../components/Login/Header.jsx";
import LoginBox from "../components/Login/LoginBox.jsx";
import Footer from "../components/Login/Footer.jsx";

const GlobalStyles = () => (
	<style>{`
    .btn-teal        { background-color: #00687a; }
    .btn-teal:hover  { background-color: #004e5c; }
    .btn-teal-dark   { background-color: #004e5c; }
    .btn-green       { background-color: #16a34a; }
    .text-teal       { color: #00687a; }
    .text-teal:hover { color: #004e5c; }
    .text-ink        { color: #020617; }
    .text-muted      { color: #45464d; }
    .border-teal     { border-color: #00687a; }
    .bg-teal         { background-color: #00687a; }
    .bg-teal-check   { background-color: #00687a; border-color: #00687a; }
    .accent-bar      { background-color: #00687a; }
    .input-wrap {
      border: 1.5px solid #e6e8ea;
      background: #fcfdfe;
      border-radius: 12px;
      transition: border-color 0.18s, box-shadow 0.18s;
    }
    .input-wrap:focus-within {
      border-color: #00687a;
      box-shadow: 0 0 0 4px rgba(0, 104, 122, 0.1);
    }
    .card-shadow {
      box-shadow: 0 10px 32px -6px rgba(0,104,122,0.08), 0 4px 10px -4px rgba(0,104,122,0.05);
      border: 1px solid rgba(0,104,122,0.07);
    }
    .btn-shadow-teal { box-shadow: 0 6px 20px -4px rgba(0,104,122,0.4); }
    .btn-shadow-green { box-shadow: 0 6px 20px -4px rgba(22,163,74,0.4); }
    .checkbox-default {
      width: 20px; height: 20px;
      border: 1.5px solid #c6c6cd;
      border-radius: 5px;
      background: #fff;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s;
      cursor: pointer;
    }
    .checkbox-checked {
      background-color: #00687a;
      border-color: #00687a;
    }
    .page-bg {
      background-color: #f7f9fb;
      background-image:
        radial-gradient(circle at 10% 20%, rgba(0,104,122,0.04) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(0,104,122,0.04) 0%, transparent 40%);
    }
    .forgot-link { color: #00687a; text-decoration: none; font-weight: 600; transition: color 0.15s; }
    .forgot-link:hover { color: #004e5c; }
    .eye-btn { color: #45464d; transition: color 0.15s; }
    .eye-btn:hover { color: #00687a; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.8s linear infinite; }
  `}</style>
);

export default function LoginPage() {
	return (
		<>
			<GlobalStyles />
			<div className="page-bg min-h-screen flex flex-col items-center justify-center px-3 py-8 sm:px-4 md:px-6">
				<main className="w-full max-w-md flex flex-col items-center">
					<Header />
					<LoginBox />
					<Footer />
				</main>
			</div>
		</>
	);
}
