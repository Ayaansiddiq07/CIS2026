import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

interface TicketConfig {
  label: string;
  price: number;
  priceDisplay: string;
  unit: string;
  description: string;
  features: string[];
  featured: boolean;
}

interface SiteContentData {
  pricing: {
    gold: TicketConfig;
    diamond: TicketConfig;
    bulk: TicketConfig;
    stall: TicketConfig;
  };
  eventInfo: {
    date: string;
    venue: string;
    tagline: string;
    description: string;
  };
}

export default function AdminSiteContent() {
  const { authFetch } = useAuth();
  const [data, setData] = useState<SiteContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch('/api/admin/site-content');
        if (!cancelled && res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch { /* ignore */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [authFetch]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await authFetch('/api/admin/site-content', {
        method: 'PUT',
        body: JSON.stringify({ pricing: data.pricing, eventInfo: data.eventInfo }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch { /* ignore */ }
    setSaving(false);
  }

  function updateTicket(tier: string, field: string, value: string | number | boolean) {
    if (!data) return;
    setData({
      ...data,
      pricing: {
        ...data.pricing,
        [tier]: { ...data.pricing[tier as keyof typeof data.pricing], [field]: value },
      },
    });
  }

  function updateFeatures(tier: string, value: string) {
    if (!data) return;
    const features = value.split('\n').filter(f => f.trim());
    setData({
      ...data,
      pricing: {
        ...data.pricing,
        [tier]: { ...data.pricing[tier as keyof typeof data.pricing], features },
      },
    });
  }

  function updateEventInfo(field: string, value: string) {
    if (!data) return;
    setData({
      ...data,
      eventInfo: { ...data.eventInfo, [field]: value },
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-red-400">Failed to load site content</p>;

  const tiers = ['gold', 'diamond', 'bulk', 'stall'] as const;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-bold">Site Content</h2>
          <p className="text-slate-500 text-sm">Edit pricing, event details, and website content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-bold hover:from-teal-400 hover:to-teal-500 disabled:opacity-50 cursor-pointer shadow-lg shadow-teal-500/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Event Info */}
      <div className="bg-[#0a0f1e] border border-white/[0.06] p-5">
        <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Event Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-[11px] font-semibold uppercase tracking-widest mb-1.5">Date</label>
            <input value={data.eventInfo.date} onChange={e => updateEventInfo('date', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-slate-400 text-[11px] font-semibold uppercase tracking-widest mb-1.5">Venue</label>
            <input value={data.eventInfo.venue} onChange={e => updateEventInfo('venue', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-400 text-[11px] font-semibold uppercase tracking-widest mb-1.5">Tagline</label>
            <input value={data.eventInfo.tagline} onChange={e => updateEventInfo('tagline', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#0a0f1e] border border-white/[0.06] p-5">
        <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Ticket Pricing</h3>
        <div className="space-y-6">
          {tiers.map(tier => {
            const ticket = data.pricing[tier];
            return (
              <div key={tier} className="border border-white/[0.06] p-4">
                <h4 className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">{tier} Tier</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-semibold uppercase mb-1">Label</label>
                    <input value={ticket.label} onChange={e => updateTicket(tier, 'label', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-semibold uppercase mb-1">Price (₹)</label>
                    <input type="number" value={ticket.price} onChange={e => updateTicket(tier, 'price', parseInt(e.target.value) || 0)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-semibold uppercase mb-1">Display Price</label>
                    <input value={ticket.priceDisplay} onChange={e => updateTicket(tier, 'priceDisplay', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-semibold uppercase mb-1">Unit</label>
                    <input value={ticket.unit} onChange={e => updateTicket(tier, 'unit', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-slate-500 text-[10px] font-semibold uppercase mb-1">Description</label>
                  <input value={ticket.description} onChange={e => updateTicket(tier, 'description', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors" />
                </div>
                <div className="mt-3">
                  <label className="block text-slate-500 text-[10px] font-semibold uppercase mb-1">Features (one per line)</label>
                  <textarea value={ticket.features.join('\n')} onChange={e => updateFeatures(tier, e.target.value)} rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors resize-none" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input type="checkbox" checked={ticket.featured} onChange={e => updateTicket(tier, 'featured', e.target.checked)} className="accent-teal-500" id={`featured-${tier}`} />
                  <label htmlFor={`featured-${tier}`} className="text-slate-400 text-xs font-medium">Featured (Most Popular badge)</label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
