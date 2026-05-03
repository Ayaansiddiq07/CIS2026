import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Users, DollarSign, Mic2, Handshake, Mail, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

interface DashboardStats {
  totalRegistrations: number;
  paidRegistrations: number;
  totalRevenue: number;
  totalSpeakers: number;
  approvedSpeakers: number;
  totalSponsors: number;
  totalContacts: number;
}

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetPhase, setResetPhase] = useState<'idle' | 'confirm' | 'processing'>('idle');
  const [confirmText, setConfirmText] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/dashboard');
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, [authFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch, load is stable
    load();
  }, [load]);

  async function handleReset() {
    if (confirmText !== 'RESET') return;
    setResetPhase('processing');
    try {
      const res = await authFetch('/api/admin/reset-database', { method: 'POST' });
      if (res.ok) {
        // Download the Excel backup
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const disposition = res.headers.get('Content-Disposition');
        const filename = disposition?.match(/filename=(.+)/)?.[1] || 'CIS_Backup.xlsx';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Refresh stats
        setShowResetConfirm(false);
        setResetPhase('idle');
        setConfirmText('');
        await load();
      } else {
        alert('Reset failed. Check server logs.');
        setResetPhase('idle');
      }
    } catch {
      alert('Network error during reset.');
      setResetPhase('idle');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Registrations', value: stats?.totalRegistrations ?? 0, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Paid Registrations', value: stats?.paidRegistrations ?? 0, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'from-amber-500 to-amber-600' },
    { label: 'Speakers', value: `${stats?.approvedSpeakers ?? 0} / ${stats?.totalSpeakers ?? 0}`, icon: Mic2, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Sponsors', value: stats?.totalSponsors ?? 0, icon: Handshake, color: 'from-teal-500 to-teal-600' },
    { label: 'Contact Messages', value: stats?.totalContacts ?? 0, icon: Mail, color: 'from-rose-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-bold">Overview</h2>
        <p className="text-slate-500 text-sm">Real-time summit statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-[#0a0f1e] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-slate-500 text-xs font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Database Reset Section */}
      <div className="bg-[#0a0f1e] border border-red-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-red-400 font-bold text-sm mb-1">Danger Zone — Database Reset</h3>
            <p className="text-slate-500 text-xs mb-4 leading-relaxed">
              This will <strong className="text-red-400">export all data</strong> (registrations, speakers, sponsors, contacts) as an Excel file and then <strong className="text-red-400">permanently delete everything</strong> from the database. The Excel backup will be downloaded automatically.
            </p>
            {!showResetConfirm ? (
              <button
                onClick={() => { setShowResetConfirm(true); setResetPhase('confirm'); }}
                className="px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                Reset Database
              </button>
            ) : (
              <div className="bg-red-500/5 border border-red-500/20 p-4 space-y-3">
                <p className="text-red-300 text-xs font-semibold">
                  ⚠️ This action is IRREVERSIBLE. Type <code className="bg-red-500/20 px-1.5 py-0.5 rounded font-mono">RESET</code> to confirm.
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type RESET to confirm"
                  className="w-full max-w-xs bg-white/[0.04] border border-red-500/30 px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-red-500/50 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    disabled={confirmText !== 'RESET' || resetPhase === 'processing'}
                    className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-red-500 transition-colors"
                  >
                    {resetPhase === 'processing' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      '☠️ Confirm Reset'
                    )}
                  </button>
                  <button
                    onClick={() => { setShowResetConfirm(false); setResetPhase('idle'); setConfirmText(''); }}
                    className="px-4 py-2 text-slate-400 text-xs font-semibold hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
