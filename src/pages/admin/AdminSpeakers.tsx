import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle2, Search } from 'lucide-react';

interface Speaker {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  bio: string;
  topic: string;
  status: 'pending' | 'approved' | 'rejected';
}

const emptyForm = { name: '', email: '', phone: '', organization: '', bio: '', topic: '', status: 'pending' as Speaker['status'] };

export default function AdminSpeakers() {
  const { authFetch } = useAuth();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/speakers');
      if (res.ok) setSpeakers(await res.json());
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

  function openEdit(s: Speaker) {
    setForm({ name: s.name, email: s.email, phone: s.phone || '', organization: s.organization || '', bio: s.bio, topic: s.topic, status: s.status });
    setEditing(s._id);
    setShowForm(true);
    setMsg('');
    setMsgType('success');
  }

  async function handleSave() {
    setSaving(true);
    setMsg('');
    try {
      const url = editing ? `/api/admin/speakers/${editing}` : '/api/admin/speakers';
      const method = editing ? 'PUT' : 'POST';
      const res = await authFetch(url, { method, body: JSON.stringify(form) });
      if (res.ok) {
        setShowForm(false);
        setMsgType('success');
        setMsg(editing ? 'Speaker updated!' : 'Speaker added!');
        await load();
      } else {
        const err = await res.json().catch(() => ({ error: 'Failed' }));
        setMsgType('error');
        setMsg(err.error || 'Failed to save speaker.');
      }
    } catch {
      setMsgType('error');
      setMsg('Network error — please check your connection.');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this speaker?')) return;
    try {
      await authFetch(`/api/admin/speakers/${id}`, { method: 'DELETE' });
      await load();
    } catch { /* ignore */ }
  }

  async function quickStatus(id: string, status: string) {
    try {
      const res = await authFetch(`/api/admin/speakers/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
      if (res.ok) {
        setMsgType('success');
        setMsg(`Speaker ${status === 'approved' ? 'approved' : 'set to pending'}.`);
      } else {
        const err = await res.json().catch(() => ({ error: 'Failed' }));
        setMsgType('error');
        setMsg(err.error || 'Failed to update status.');
      }
      await load();
    } catch {
      setMsgType('error');
      setMsg('Network error — could not update status.');
    }
  }

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
          <h2 className="text-white text-lg font-bold">Speakers</h2>
          <p className="text-slate-500 text-sm">{speakers.length} total speakers</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-bold cursor-pointer shadow-lg shadow-teal-500/20">
          <Plus className="w-4 h-4" /> Add Speaker
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, organization..."
          className="w-full bg-[#0a0f1e] border border-white/[0.08] pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
        />
      </div>

      {msg && (
        <div className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border ${
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
          <div className="bg-[#0a0f1e] border border-white/[0.08] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-white font-bold text-sm">{editing ? 'Edit Speaker' : 'Add Speaker'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              {(['name', 'email', 'phone', 'organization', 'topic'] as const).map(field => (
                <div key={field}>
                  <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">{field}</label>
                  <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'pending' | 'approved' | 'rejected' })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors">
                  <option value="pending" className="bg-[#0a0f1e]">Pending</option>
                  <option value="approved" className="bg-[#0a0f1e]">Approved</option>
                  <option value="rejected" className="bg-[#0a0f1e]">Rejected</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-white/[0.06] flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-400 text-xs font-semibold hover:text-white cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-white text-xs font-bold disabled:opacity-50 cursor-pointer">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0a0f1e] border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Email', 'Organization', 'Topic', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-slate-500 text-[10px] font-semibold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {speakers
                .filter(s => {
                  if (!search.trim()) return true;
                  const q = search.toLowerCase();
                  return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.organization || '').toLowerCase().includes(q) || s.topic.toLowerCase().includes(q);
                })
                .map(s => (
                <tr key={s._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white text-sm font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{s.email}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{s.organization || '—'}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm max-w-[200px] truncate">{s.topic}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => quickStatus(s._id, s.status === 'approved' ? 'pending' : 'approved')}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                        s.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        s.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {s.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-slate-500 hover:text-teal-400 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 text-slate-500 hover:text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {speakers.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">No speakers yet. Click "Add Speaker" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
