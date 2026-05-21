import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center ${
      isAdmin ? "bg-[#0A1B3D]/90" : "bg-[#0A1B3D]/90"
    } backdrop-blur-xl border-b border-white/10`}>
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/smt-logo-white.png" alt="SMT" className="h-8 w-auto" />
          <span className="text-white font-semibold text-sm tracking-wide">
            Loyalty
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Programs", href: "/#programs" },
            { label: "Join", href: "/signup" },
            { label: "My Card", href: "/signup" },
            { label: "Dashboard", href: "/admin" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/signup"
            className="hidden md:inline-flex items-center rounded-full px-5 py-2 text-sm font-medium bg-white text-[#0A1B3D] hover:bg-[#03055F] hover:text-white transition-all duration-300"
          >
            Get Your Card
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-[#0A1B3D] flex flex-col items-center gap-8 pt-12">
          {["Programs", "Join", "My Card", "Dashboard"].map((label) => (
            <Link
              key={label}
              to={label === "Programs" ? "/#programs" : label === "Dashboard" ? "/admin" : "/signup"}
              onClick={() => setMobileOpen(false)}
              className="text-xl font-medium text-white/80 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

