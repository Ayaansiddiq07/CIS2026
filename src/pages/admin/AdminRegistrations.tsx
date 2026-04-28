import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  amount: number;
  status: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  createdAt: string;
}

export default function AdminRegistrations() {
  const { authFetch } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch('/api/admin/registrations');
        if (!cancelled && res.ok) setRegistrations(await res.json());
      } catch { /* ignore */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [authFetch]);

  const filtered = filter === 'all' ? registrations : registrations.filter(r => r.status === filter);

  const statusColors: Record<string, string> = {
    paid: 'bg-green-500/10 text-green-400 border-green-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const ticketColors: Record<string, string> = {
    gold: 'text-amber-400',
    diamond: 'text-blue-400',
    bulk: 'text-purple-400',
    stall: 'text-teal-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-lg font-bold">Registrations</h2>
          <p className="text-slate-500 text-sm">{registrations.length} total registrations</p>
        </div>
        <div className="flex gap-1 bg-[#0a0f1e] border border-white/[0.06] rounded-lg p-1">
          {['all', 'paid', 'pending', 'failed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-md capitalize transition-colors cursor-pointer ${
                filter === f ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0a0f1e] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Email', 'Phone', 'Ticket', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-slate-500 text-[10px] font-semibold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white text-sm font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{r.email}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{r.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold capitalize ${ticketColors[r.ticketType] || 'text-white'}`}>{r.ticketType}</span>
                  </td>
                  <td className="px-4 py-3 text-white text-sm font-medium">₹{r.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[r.status] || ''}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-sm">No registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
