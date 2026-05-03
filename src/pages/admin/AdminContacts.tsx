import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ContactMsg {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContacts() {
  const { authFetch } = useAuth();
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch('/api/admin/contacts');
        if (!cancelled && res.ok) setContacts(await res.json());
      } catch { /* ignore */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [authFetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-bold">Contact Messages</h2>
        <p className="text-slate-500 text-sm">{contacts.length} messages received</p>
      </div>

      <div className="space-y-3">
        {contacts.map(c => (
          <div
            key={c._id}
            className="bg-[#0a0f1e] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-colors"
          >
            <button
              onClick={() => setExpanded(expanded === c._id ? null : c._id)}
              className="w-full px-5 py-4 flex items-start justify-between text-left cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white text-sm font-semibold">{c.name}</span>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="text-slate-500 text-xs">{c.email}</span>
                </div>
                <p className="text-slate-300 text-sm font-medium truncate">{c.subject}</p>
              </div>
              <span className="text-slate-600 text-[10px] shrink-0 ml-4">
                {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
            </button>
            {expanded === c._id && (
              <div className="px-5 pb-4 pt-0 border-t border-white/[0.04]">
                <p className="text-slate-400 text-sm leading-relaxed mt-3 whitespace-pre-wrap">{c.message}</p>
                <div className="mt-3 flex gap-3">
                  <a href={`mailto:${c.email}?subject=Re: ${c.subject}`} className="text-teal-400 text-xs font-semibold hover:text-teal-300">
                    Reply via Email →
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="bg-[#0a0f1e] border border-white/[0.06] px-5 py-8 text-center text-slate-500 text-sm">
            No contact messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
