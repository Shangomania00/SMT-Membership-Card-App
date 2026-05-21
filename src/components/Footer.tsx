import { Link } from "react-router";
import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#070F24]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/smt-logo-white.png" alt="SMT" className="h-8" />
              <span className="text-sm font-semibold">Loyalty</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Saif Mohammad Training Institute loyalty program. Earn rewards
              as you grow into a professional trainer.
            </p>
            <div className="mt-6 space-y-2">
              <a
                href="https://wa.me/971551159080"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
              >
                <Phone size={14} />
                +971 55 115 9080
              </a>
              <p className="flex items-center gap-2 text-sm text-white/40">
                <MapPin size={14} />
                Dubai, UAE
              </p>
            </div>
          </div>

          {/* Programs */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/30 mb-4">
              Programs
            </p>
            <div className="space-y-3">
              {[
                "Certified Professional Trainer",
                "Advanced TOT",
                "Basic TOT",
                "Free Workshops",
              ].map((p) => (
                <p key={p} className="text-sm text-white/40 hover:text-white/70 transition-colors cursor-default">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/30 mb-4">
              Quick Links
            </p>
            <div className="space-y-3">
              {[
                { label: "Get Your Card", href: "/signup" },
                { label: "My Loyalty Card", href: "/signup" },
                { label: "Admin Dashboard", href: "/admin" },
                { label: "smtuae.org", href: "https://www.smtuae.org" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  className="block text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Saif Mohammad Training Institute. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            KHDA Licensed &middot; Internationally Recognized
          </p>
        </div>
      </div>
    </footer>
  );
}

