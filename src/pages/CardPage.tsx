import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Copy, Check, ArrowLeft, Loader2, Gift, TrendingUp } from "lucide-react";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";

export default function CardPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const [copied, setCopied] = useState(false);
  const [animatedStamps, setAnimatedStamps] = useState(0);

  const { data: member, isLoading } = trpc.member.getById.useQuery(
    { memberId: memberId! },
    { enabled: !!memberId }
  );

  useEffect(() => {
    if (member) {
      const target = member.stamps;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 20));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStamps(current);
      }, 25);
      return () => clearInterval(timer);
    }
  }, [member]);

  const copyId = () => {
    if (member?.memberId) {
      navigator.clipboard.writeText(member.memberId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1B3D] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#03055F]" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-[#0A1B3D] text-white flex flex-col items-center justify-center px-6">
        <img src="/smt-logo-white.png" alt="SMT" className="h-12 mb-6" />
        <h1 className="text-2xl font-bold mb-3">Card Not Found</h1>
        <p className="text-sm text-white/40 mb-8">
          This loyalty card does not exist or has been removed.
        </p>
        <Link
          to="/signup"
          className="px-8 py-3 rounded-full bg-white text-[#0A1B3D] font-semibold text-sm hover:bg-[#03055F] hover:text-white transition-all"
        >
          Create Your Card
        </Link>
      </div>
    );
  }

  const cardUrl = `${window.location.origin}/card/${member.memberId}`;
  const stampsInCycle = member.stamps % 10;
  const stampsNeeded = 10 - stampsInCycle;
  const progress = (stampsInCycle / 10) * 100;

  return (
    <div className="min-h-screen bg-[#0A1B3D] text-white">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[440px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Home
          </Link>

          {/* Digital Card */}
          <div className="rounded-3xl border border-white/10 overflow-hidden" style={{
            background: "linear-gradient(160deg, rgba(3,5,95,0.5) 0%, rgba(10,27,61,0.9) 100%)",
          }}>
            {/* Card Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <img src="/smt-logo-white.png" alt="SMT" className="h-7" />
                <span className="text-[10px] uppercase tracking-widest text-white/30">
                  SMT Loyalty
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* Member Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#03055F]/20 border-2 border-[#03055F]/40 flex items-center justify-center mb-3 overflow-hidden">
                  <span className="text-xl font-bold text-[#03055F]">
                    {member.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-semibold">{member.fullName}</h2>
                <button
                  onClick={copyId}
                  className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-white/30 hover:text-white/60 transition-colors font-mono"
                >
                  {member.memberId}
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>

              {/* Stamp Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40 uppercase tracking-wider">
                    Stamp Progress
                  </span>
                  <span className="text-xs font-medium text-[#03055F]">
                    {animatedStamps}/10
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#03055F] to-[#03055F]/70 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-white/30 mt-2 text-center">
                  {stampsNeeded} more stamps for your next reward
                </p>
              </div>

              {/* Stamp Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                      i < stampsInCycle
                        ? "bg-[#03055F] text-white"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {i < stampsInCycle ? (
                      <Check size={14} />
                    ) : (
                      <span className="text-[10px] text-white/20">{i + 1}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Barcode */}
              <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center">
                <Barcode
                  value={member.barcode}
                  width={1.5}
                  height={50}
                  fontSize={11}
                  background="transparent"
                  lineColor="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Share QR */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
              Share Your Card
            </p>
            <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10">
              <QRCodeSVG value={cardUrl} size={140} level="M" fgColor="#ffffff" bgColor="transparent" />
            </div>
          </div>

          {/* Transactions */}
          {member.transactions && member.transactions.length > 0 && (
            <div className="mt-8">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-4">
                Recent Activity
              </p>
              <div className="space-y-2">
                {member.transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      txn.points > 0 ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {txn.points > 0 ? "+" : ""}{txn.points}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 truncate">{txn.description}</p>
                      <p className="text-[10px] text-white/20">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="mt-6 pb-8">
            <NotificationList memberId={member.memberId} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationList({ memberId }: { memberId: string }) {
  const { data: notifications } = trpc.notification.history.useQuery({
    memberId,
    limit: 10,
  });

  if (!notifications || notifications.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-white/30 uppercase tracking-wider mb-4">
        Notifications
      </p>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-xl bg-[#03055F]/5 border border-[#03055F]/10"
          >
            <p className="text-sm font-medium text-[#03055F]">{n.title}</p>
            <p className="text-sm text-white/50 mt-1">{n.message}</p>
            <p className="text-[10px] text-white/20 mt-2">
              {new Date(n.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
