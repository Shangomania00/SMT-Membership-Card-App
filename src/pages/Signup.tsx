import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Check, Loader2, ArrowLeft, Award, BookOpen, Gift } from "lucide-react";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const register = trpc.member.register.useMutation({
    onSuccess: (data) => {
      navigate(`/card/${data.memberId}`);
    },
    onError: (err) => {
      setError(err.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !phone.trim()) {
      setError("Full name and phone number are required.");
      return;
    }
    register.mutate({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A1B3D] text-white">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left */}
            <div className="lg:col-span-2">
              <p className="text-xs text-[#03055F] font-medium uppercase tracking-widest mb-4">
                Join SMT Loyalty
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Get Your Digital
                <br />
                <span className="text-[#03055F]">Loyalty Card</span>
              </h1>
              <p className="text-sm text-white/40 mt-4 leading-relaxed">
                Create your free SMT loyalty card and start earning digital
                stamps on every training program you attend in Dubai.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Award, text: "Earn stamps on every program" },
                  { icon: BookOpen, text: "Track progress toward rewards" },
                  { icon: Gift, text: "Unlock free workshops & discounts" },
                  { icon: Check, text: "No app download needed" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#03055F]/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={12} className="text-[#03055F]" />
                    </div>
                    <span className="text-sm text-white/60">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl p-8 border border-white/10 bg-white/[0.02]">
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] transition-colors text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={register.isPending}
                    className="w-full py-4 rounded-full bg-white text-[#0A1B3D] font-semibold text-sm hover:bg-[#03055F] hover:text-white transition-all duration-300 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                  >
                    {register.isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create My Loyalty Card"
                    )}
                  </button>

                  <p className="text-[11px] text-white/20 text-center">
                    By joining, you agree to SMT Loyalty terms. Your data is secure.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

