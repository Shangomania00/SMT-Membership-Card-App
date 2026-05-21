import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Award,
  BookOpen,
  Users,
  TrendingUp,
  Star,
  Shield,
  Zap,
  Gift,
  ArrowRight,
  Check,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { num: "500+", label: "Certified Trainers", sub: "Worldwide" },
  { num: "50+", label: "Training Courses", sub: "Programs" },
  { num: "98%", label: "Satisfaction Rate", sub: "Member Satisfaction" },
  { num: "15+", label: "Years Experience", sub: "Since 2009" },
];

const programs = [
  {
    title: "Certified Professional Trainer",
    code: "CPT-03",
    desc: "Internationally recognized professional trainer certification. Master training delivery and earn your CPT credential.",
    date: "June 16",
    spots: 12,
    icon: Award,
  },
  {
    title: "Advanced TOT",
    code: "TOT-02",
    desc: "Advanced Train-the-Trainer program for experienced trainers seeking specialized certification.",
    date: "June 9",
    spots: 9,
    icon: BookOpen,
  },
  {
    title: "Basic TOT",
    code: "TOT-01",
    desc: "Foundational Train-the-Trainer certification. Start your journey to becoming a certified trainer.",
    date: "June 2",
    spots: 4,
    icon: Users,
  },
];

const freeWorkshops = [
  "Build Your Project From Scratch",
  "Emotional Intelligence at Work",
  "Investment and Its Types",
  "Give Me a Chance - Public Speaking",
  "Skills Short Workshops",
];

const loyaltyFeatures = [
  {
    icon: Zap,
    title: "Earn on Every Visit",
    desc: "Collect digital stamps every time you attend a workshop or program. Your progress tracks automatically.",
  },
  {
    icon: Gift,
    title: "Unlock Rewards",
    desc: "Fill your stamp card and unlock free workshops, course discounts, and exclusive member-only sessions.",
  },
  {
    icon: Shield,
    title: "Digital Barcode Card",
    desc: "Your unique member barcode lives in your browser. Staff scan it to add points instantly.",
  },
  {
    icon: Star,
    title: "Stay Notified",
    desc: "Get push notifications about new programs, upcoming workshops, and when you earn rewards.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [activeProgram, setActiveProgram] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const heroEls = heroRef.current?.querySelectorAll(".hero-animate");
      if (heroEls) {
        gsap.fromTo(
          heroEls,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
        );
      }

      // Programs
      if (programsRef.current) {
        gsap.fromTo(
          programsRef.current.querySelectorAll(".program-card"),
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
            scrollTrigger: { trigger: programsRef.current, start: "top 80%" },
          }
        );
      }

      // Features
      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.querySelectorAll(".feature-item"),
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
            scrollTrigger: { trigger: featuresRef.current, start: "top 80%" },
          }
        );
      }

      // Stats counter
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll(".stat-item"),
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)",
            scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
          }
        );
      }

      // CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.querySelectorAll(".cta-animate"),
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
            scrollTrigger: { trigger: ctaRef.current, start: "top 80%" },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1B3D] text-white">
      <Navbar />

      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      >
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#03055F]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#03055F]/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#03055F]/10 rounded-full blur-[150px]" />

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-[55%]">
            <div className="hero-animate inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#03055F]" />
              <span className="text-xs text-white/60 tracking-wide">Saif Mohammad Training Institute</span>
            </div>
            <h1 className="hero-animate text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Your Training.
              <br />
              <span className="text-[#03055F]">Your Rewards.</span>
            </h1>
            <p className="hero-animate text-base md:text-lg text-white/60 mt-6 max-w-lg leading-relaxed">
              SMT transforms individuals into professional trainers. Now, every
              workshop you attend earns you digital stamps toward exclusive
              rewards. Join 500+ certified trainers in our loyalty program.
            </p>
            <div className="hero-animate flex flex-wrap gap-4 mt-8">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 bg-white text-[#0A1B3D] font-semibold text-sm hover:bg-[#03055F] hover:text-white transition-all duration-300"
              >
                Get Your Loyalty Card
                <ArrowRight size={16} />
              </Link>
              <a
                href="#programs"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-all duration-300"
              >
                View Programs
              </a>
            </div>

            {/* Mini trust badges */}
            <div className="hero-animate flex items-center gap-6 mt-10">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#03055F] to-[#0A1B3D] border-2 border-[#0A1B3D] flex items-center justify-center text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/40">
                <span className="text-white/70 font-medium">500+</span> members already earning
              </p>
            </div>
          </div>

          {/* Right - Preview Card */}
          <div className="lg:w-[45%] flex justify-center">
            <div className="hero-animate relative w-full max-w-[360px]">
              <div
                className="rounded-3xl p-6 border border-white/10"
                style={{
                  background: "linear-gradient(145deg, rgba(3,5,95,0.4), rgba(10,27,61,0.8))",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <img src="/smt-logo-white.png" alt="SMT" className="h-6" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Loyalty Card
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <img
                    src="/hero-person.jpg"
                    alt="Member"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <p className="text-lg font-semibold">Saif Mohammad</p>
                <p className="text-xs text-white/40 font-mono mb-6">
                  SMT-2025-0001
                </p>

                {/* Stamp Grid */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center ${
                        i < 7
                          ? "bg-[#03055F] text-white"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      {i < 7 && <Check size={12} />}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/50 text-center">
                  7/10 stamps — 3 more for a reward!
                </p>

                {/* Barcode */}
                <div className="mt-6 bg-white/5 rounded-xl p-3 flex flex-col items-center">
                  <div className="flex gap-0.5 h-8 items-end">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white/60"
                        style={{
                          width: Math.random() > 0.5 ? 2 : 1,
                          height: `${40 + Math.random() * 60}%`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/30 mt-2 font-mono tracking-wider">
                    SMT20250001
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-[10px] font-semibold bg-[#03055F] text-white"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                KHDA Licensed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="relative py-16 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">
                {s.num}
              </p>
              <p className="text-sm text-white/70 mt-1">{s.label}</p>
              <p className="text-xs text-white/30">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROGRAMS ===== */}
      <section
        id="programs"
        ref={programsRef}
        className="relative py-24 px-6"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs text-[#03055F] font-medium uppercase tracking-widest mb-3">
                Upcoming in Dubai
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Training Programs
              </h2>
              <p className="text-sm text-white/50 mt-3 max-w-md">
                KHDA licensed programs with internationally recognized certificates.
                Limited seats available.
              </p>
            </div>
            <span className="text-xs text-white/30">
              Next sessions filling fast
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {programs.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="program-card group relative rounded-2xl p-6 border border-white/5 hover:border-[#03055F]/50 transition-all duration-300 cursor-pointer"
                  style={{
                    background:
                      activeProgram === i
                        ? "linear-gradient(145deg, rgba(3,5,95,0.3), rgba(10,27,61,0.6))"
                        : "rgba(255,255,255,0.02)",
                  }}
                  onClick={() => setActiveProgram(i)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#03055F]/20 flex items-center justify-center">
                      <Icon size={20} className="text-[#03055F]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-mono">
                      {p.code}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-white/40 mb-4 leading-relaxed">
                    {p.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">
                        {p.date}
                      </span>
                    </div>
                    <span className="text-xs text-amber-400/70">
                      {p.spots} seats left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Free Workshops */}
          <div className="mt-8 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-400/80 uppercase tracking-wider">
                Free Workshops
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {freeWorkshops.map((w) => (
                <span
                  key={w}
                  className="px-4 py-2 rounded-full text-sm text-white/70 bg-white/5 border border-white/10 hover:border-[#03055F]/50 hover:text-white transition-all cursor-default"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOYALTY FEATURES ===== */}
      <section ref={featuresRef} className="relative py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#03055F] font-medium uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Earn As You Learn
            </h2>
            <p className="text-sm text-white/40 mt-3 max-w-lg mx-auto">
              Attend SMT programs, collect digital stamps, and unlock exclusive
              rewards. Simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loyaltyFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="feature-item flex gap-5 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#03055F]/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#03055F]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#03055F]/20 transition-colors">
                    <Icon size={22} className="text-[#03055F]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section ref={ctaRef} className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#03055F]/5 to-transparent" />
        <div className="relative max-w-[600px] mx-auto text-center">
          <h2 className="cta-animate text-3xl md:text-5xl font-bold tracking-tight">
            Ready to Start
            <br />
            <span className="text-[#03055F]">Earning Rewards?</span>
          </h2>
          <p className="cta-animate text-sm text-white/40 mt-4 max-w-md mx-auto leading-relaxed">
            Join the SMT Loyalty program today. Get your digital stamp card and
            start collecting rewards on every training program you attend in
            Dubai.
          </p>
          <div className="cta-animate mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 bg-white text-[#0A1B3D] font-semibold text-sm hover:bg-[#03055F] hover:text-white transition-all duration-300"
            >
              Create Your Card
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="cta-animate text-xs text-white/20 mt-4">
            Free to join. No app download required.
          </p>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

