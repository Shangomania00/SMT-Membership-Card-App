import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1B3D] text-white flex flex-col items-center justify-center px-6">
      <img src="/smt-logo-white.png" alt="SMT" className="h-14 mb-6" />
      <h1 className="text-5xl font-extrabold mb-3">404</h1>
      <p className="text-sm text-white/40 mb-8">Page not found.</p>
      <Link
        to="/"
        className="px-8 py-3 rounded-full bg-white text-[#0A1B3D] font-semibold text-sm hover:bg-[#03055F] hover:text-white transition-all"
      >
        Go Home
      </Link>
    </div>
  );
}

