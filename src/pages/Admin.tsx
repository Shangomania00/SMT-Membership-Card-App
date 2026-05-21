import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Users,
  CreditCard,
  TrendingUp,
  Gift,
  Search,
  Plus,
  Scan,
  Send,
  Bell,
  Activity,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Barcode,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A1B3D] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#03055F]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A1B3D] text-white flex flex-col items-center justify-center px-6">
        <img src="/smt-logo-white.png" alt="SMT" className="h-14 mb-6" />
        <h1 className="text-2xl font-bold mb-3">Staff Access</h1>
        <p className="text-sm text-white/40 mb-8 text-center max-w-sm">
          Sign in to manage members, issue points, and send notifications.
        </p>
        <a
          href={`/api/oauth/authorize?app_id=${import.meta.env.VITE_APP_ID}`}
          className="px-8 py-3 rounded-full bg-white text-[#0A1B3D] font-semibold text-sm hover:bg-[#03055F] hover:text-white transition-all"
        >
          Sign In
        </a>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedMember, setScannedMember] = useState<string | null>(null);
  const [issueMemberId, setIssueMemberId] = useState("");
  const [issuePoints, setIssuePoints] = useState("1");
  const [issueDesc, setIssueDesc] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifTarget, setNotifTarget] = useState<"all" | "member">("all");
  const [notifMemberId, setNotifMemberId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data: stats } = trpc.admin.stats.useQuery();
  const { data: memberList } = trpc.member.list.useQuery({
    search: search || undefined, page, limit: 10,
  });
  const { data: recentActivity } = trpc.admin.recentActivity.useQuery();
  const { data: notifications } = trpc.notification.list.useQuery();

  const issueMutation = trpc.points.issue.useMutation({
    onSuccess: (data) => {
      setSuccessMsg(data.rewardUnlocked ? `Added ${issuePoints} stamp(s) + Reward unlocked!` : `Added ${issuePoints} stamp(s)`);
      setIssueMemberId(""); setIssuePoints("1"); setIssueDesc("");
      utils.admin.stats.invalidate();
      utils.member.list.invalidate();
      utils.admin.recentActivity.invalidate();
      setTimeout(() => setSuccessMsg(""), 3000);
    },
  });

  const notifMutation = trpc.notification.send.useMutation({
    onSuccess: () => {
      setSuccessMsg("Notification sent!");
      setNotifTitle(""); setNotifMessage(""); setNotifMemberId("");
      utils.notification.list.invalidate();
      setTimeout(() => setSuccessMsg(""), 3000);
    },
  });

  useEffect(() => {
    if (showScanner && scannerDivRef.current) {
      const scanner = new Html5Qrcode("qr-scanner");
      scannerRef.current = scanner;
      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScannedMember(decodedText);
          setIssueMemberId(decodedText.replace("SMT", ""));
          scanner.stop().catch(() => {});
          setShowScanner(false);
        },
        () => {}
      ).catch(() => {});
    }
    return () => { if (scannerRef.current) scannerRef.current.stop().catch(() => {}); };
  }, [showScanner]);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueMemberId || !issuePoints) return;
    issueMutation.mutate({
      memberId: issueMemberId, points: parseInt(issuePoints),
      description: issueDesc || undefined,
    });
  };

  const handleSendNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    notifMutation.mutate({
      title: notifTitle, message: notifMessage, target: notifTarget,
      targetMemberId: notifTarget === "member" ? notifMemberId || undefined : undefined,
    });
  };

  const statCards = [
    { icon: Users, label: "Total Members", value: stats?.totalMembers ?? 0 },
    { icon: CreditCard, label: "Active Cards", value: stats?.activeCards ?? 0 },
    { icon: TrendingUp, label: "Total Stamps", value: stats?.totalStamps ?? 0 },
    { icon: Gift, label: "Rewards Given", value: stats?.rewardsRedeemed ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-[#0A1B3D] text-white">
      {/* Nav */}
      <nav className="h-14 flex items-center px-6 border-b border-white/5">
        <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/smt-logo-white.png" alt="SMT" className="h-7" />
              <span className="text-sm font-semibold">Admin</span>
            </Link>
          </div>
          <Link to="/" className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Home
          </Link>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2 animate-fadeIn">
            <Check size={16} /> {successMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="rounded-xl p-5 bg-white/[0.02] border border-white/5">
                <Icon size={24} className="text-[#03055F] mb-3" />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* QR Scanner */}
          <div className="rounded-xl p-5 bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white/70">
              <Scan size={16} className="text-[#03055F]" />
              QR Scanner
            </h3>
            {showScanner ? (
              <div className="relative">
                <div id="qr-scanner" ref={scannerDivRef} className="rounded-lg overflow-hidden" />
                <button onClick={() => { setShowScanner(false); if (scannerRef.current) scannerRef.current.stop().catch(() => {}); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[#03055F]/40 transition-colors"
                style={{ animation: "pulse 2s infinite" }}
                onClick={() => setShowScanner(true)}>
                <Barcode size={40} className="mx-auto text-white/20 mb-3" />
                <p className="text-sm font-medium">Scan Member Barcode</p>
                <p className="text-xs text-white/30 mt-1">Click to open camera</p>
              </div>
            )}
            {scannedMember && <p className="mt-3 text-xs text-green-400">Scanned: {scannedMember}</p>}
          </div>

          {/* Issue Points */}
          <div className="rounded-xl p-5 bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white/70">
              <Plus size={16} className="text-[#03055F]" />
              Issue Points
            </h3>
            <form onSubmit={handleIssue} className="space-y-3">
              <input type="text" value={issueMemberId} onChange={(e) => setIssueMemberId(e.target.value)}
                placeholder="Member ID (e.g. SMT-2025-0001)"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] text-sm" />
              <div className="flex gap-2">
                <input type="number" min={1} max={100} value={issuePoints} onChange={(e) => setIssuePoints(e.target.value)}
                  placeholder="Points" className="w-20 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] text-sm" />
                <input type="text" value={issueDesc} onChange={(e) => setIssueDesc(e.target.value)}
                  placeholder="Description (optional)" className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] text-sm" />
              </div>
              <button type="submit" disabled={issueMutation.isPending || !issueMemberId}
                className="w-full py-2.5 rounded-full bg-white text-[#0A1B3D] font-semibold text-sm hover:bg-[#03055F] hover:text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                {issueMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Issue Points
              </button>
            </form>
          </div>
        </div>

        {/* Member Table */}
        <div className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 mb-6">
          <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white/70">Members</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] text-sm w-full sm:w-56" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-left">
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Stamps</th>
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Joined</th>
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {memberList?.members.map((m) => (
                  <tr key={m.id} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-white/40">{m.memberId}</td>
                    <td className="px-5 py-3.5 text-white font-medium text-sm">{m.fullName}</td>
                    <td className="px-5 py-3.5 text-white/40 text-sm">{m.phone}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#03055F]/15 text-[#03055F] text-xs font-medium">
                        {m.stamps}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/30 text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setIssueMemberId(m.memberId); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="px-3 py-1 rounded-full bg-[#03055F] text-white text-xs font-medium hover:bg-white hover:text-[#0A1B3D] transition-all">
                        Add Points
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {memberList && memberList.totalPages > 1 && (
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                className="p-1.5 rounded-full bg-white/5 text-white/30 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all">
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs text-white/30">Page {page} of {memberList.totalPages}</span>
              <button onClick={() => setPage(Math.min(memberList.totalPages, page + 1))} disabled={page >= memberList.totalPages}
                className="p-1.5 rounded-full bg-white/5 text-white/30 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Notifications */}
          <div className="rounded-xl p-5 bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white/70">
              <Bell size={16} className="text-[#03055F]" />
              Send Notification
            </h3>
            <form onSubmit={handleSendNotif} className="space-y-3">
              <input type="text" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="Title" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] text-sm" />
              <textarea value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)}
                placeholder="Message content" rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] text-sm resize-none" />
              <div className="flex gap-2">
                <select value={notifTarget} onChange={(e) => setNotifTarget(e.target.value as "all" | "member")}
                  className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#03055F]">
                  <option value="all" className="bg-[#0A1B3D]">All Members</option>
                  <option value="member" className="bg-[#0A1B3D]">Specific Member</option>
                </select>
                {notifTarget === "member" && (
                  <input type="text" value={notifMemberId} onChange={(e) => setNotifMemberId(e.target.value)}
                    placeholder="Member ID" className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#03055F] text-sm" />
                )}
              </div>
              <button type="submit" disabled={notifMutation.isPending || !notifTitle || !notifMessage}
                className="w-full py-2.5 rounded-full bg-white text-[#0A1B3D] font-semibold text-sm hover:bg-[#03055F] hover:text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                {notifMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Send Notification
              </button>
            </form>
          </div>

          {/* Activity */}
          <div className="rounded-xl p-5 bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white/70">
              <Activity size={16} className="text-[#03055F]" />
              Recent Activity
            </h3>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {recentActivity?.map((act) => (
                <div key={act.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02]">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                    act.points > 0 ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {act.points > 0 ? "+" : ""}{act.points}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">{act.memberName}</p>
                    <p className="text-[11px] text-white/25 truncate">{act.description}</p>
                  </div>
                  <span className="text-[10px] text-white/20 flex-shrink-0">{new Date(act.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <p className="text-sm text-white/20 text-center py-8">No activity yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Notification History */}
        <div className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
          <div className="p-5 border-b border-white/5">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-white/70">
              <MessageSquare size={16} className="text-[#03055F]" />
              Sent Notifications
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-left">
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Time</th>
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Message</th>
                  <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Target</th>
                </tr>
              </thead>
              <tbody>
                {notifications?.notifications.map((n) => (
                  <tr key={n.id} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-white/30 text-xs">{new Date(n.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-white font-medium text-sm">{n.title}</td>
                    <td className="px-5 py-3.5 text-white/40 text-sm max-w-xs truncate">{n.message}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        n.target === "all" ? "bg-[#03055F]/15 text-[#03055F]" : "bg-purple-500/10 text-purple-400"
                      }`}>
                        {n.target === "all" ? "All" : "Member"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); border-color: rgba(255,255,255,0.1); }
          50% { transform: scale(1.005); border-color: rgba(3,5,95,0.25); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
