import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle2 } from 'lucide-react';

interface Sponsor {
  _id: string;
  name: string;
  logoUrl: string;
  website: string;
  tier: 'title' | 'gold' | 'silver' | 'community';
  description: string;
  isActive: boolean;
  order: number;
}

const emptyForm = { name: '', logoUrl: '', website: '', tier: 'community' as Sponsor['tier'], description: '', isActive: true, order: 0 };

export default function AdminSponsors() {
  const { authFetch } = useAuth();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/sponsors');
      if (res.ok) setSponsors(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, [authFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch, load is stable
    load();
  }, [load]);

  function openAdd() {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
    setMsg('');
    setMsgType('success');
  }

  function openEdit(s: Sponsor) {
    setForm({ name: s.name, logoUrl: s.logoUrl, website: s.website, tier: s.tier, description: s.description, isActive: s.isActive, order: s.order });
    setEditing(s._id);
    setShowForm(true);
    setMsg('');
    setMsgType('success');
  }

  async function handleSave() {
    setSaving(true);
    setMsg('');
    try {
      const url = editing ? `/api/admin/sponsors/${editing}` : '/api/admin/sponsors';
      const method = editing ? 'PUT' : 'POST';
      const res = await authFetch(url, { method, body: JSON.stringify(form) });
      if (res.ok) {
        setShowForm(false);
        setMsgType('success');
        setMsg(editing ? 'Sponsor updated!' : 'Sponsor added!');
        await load();
      } else {
        const err = await res.json().catch(() => ({ error: 'Failed' }));
        setMsgType('error');
        setMsg(err.error || 'Failed to save sponsor.');
      }
    } catch {
      setMsgType('error');
      setMsg('Network error — please check your connection.');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this sponsor?')) return;
    try {
      await authFetch(`/api/admin/sponsors/${id}`, { method: 'DELETE' });
      await load();
    } catch { /* ignore */ }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      const res = await authFetch(`/api/admin/sponsors/${id}`, { method: 'PUT', body: JSON.stringify({ isActive: !isActive }) });
      if (res.ok) {
        setMsgType('success');
        setMsg(`Sponsor ${!isActive ? 'activated' : 'deactivated'}.`);
      } else {
        const err = await res.json().catch(() => ({ error: 'Failed' }));
        setMsgType('error');
        setMsg(err.error || 'Failed to toggle status.');
      }
      await load();
    } catch {
      setMsgType('error');
      setMsg('Network error — could not toggle status.');
    }
  }

  const tierColors: Record<string, string> = {
    title: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    silver: 'bg-slate-400/10 text-slate-300 border-slate-400/20',
    community: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-bold">Sponsors & Partners</h2>
          <p className="text-slate-500 text-sm">{sponsors.length} total sponsors</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-bold rounded-lg cursor-pointer shadow-lg shadow-teal-500/20">
          <Plus className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border ${
          msgType === 'error'
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
        }`}>
          {msgType === 'error' ? <X className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />} {msg}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="bg-[#0a0f1e] border border-white/[0.08] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-white font-bold text-sm">{editing ? 'Edit Sponsor' : 'Add Sponsor'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              {(['name', 'logoUrl', 'website'] as const).map(field => (
                <div key={field}>
                  <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
                    {field === 'logoUrl' ? 'Logo URL' : field}
                  </label>
                  <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Tier</label>
                <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value as Sponsor['tier'] })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors">
                  <option value="title" className="bg-[#0a0f1e]">Title Sponsor</option>
                  <option value="gold" className="bg-[#0a0f1e]">Gold Sponsor</option>
                  <option value="silver" className="bg-[#0a0f1e]">Silver Sponsor</option>
                  <option value="community" className="bg-[#0a0f1e]">Community Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-teal-500" />
                    <span className="text-slate-400 text-xs font-medium">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-white/[0.06] flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-400 text-xs font-semibold rounded-lg hover:text-white cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-white text-xs font-bold rounded-lg disabled:opacity-50 cursor-pointer">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0a0f1e] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Website', 'Tier', 'Active', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-slate-500 text-[10px] font-semibold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sponsors.map(s => (
                <tr key={s._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.logoUrl ? (
                        <img src={s.logoUrl} alt={s.name} className="w-8 h-8 rounded object-cover bg-white" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-white/[0.06] flex items-center justify-center text-slate-500 text-xs font-bold">{s.name.charAt(0)}</div>
                      )}
                      <span className="text-white text-sm font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{s.website || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tierColors[s.tier]}`}>{s.tier}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(s._id, s.isActive)} className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${s.isActive ? 'bg-teal-500' : 'bg-slate-700'}`}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all ${s.isActive ? 'left-[18px]' : 'left-[3px]'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-slate-500 hover:text-teal-400 rounded cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 text-slate-500 hover:text-red-400 rounded cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {sponsors.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">No sponsors yet. Click "Add Sponsor" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
