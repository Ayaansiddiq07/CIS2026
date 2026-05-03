import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BankyTextReveal from '../components/BankyTextReveal';

const bankyEase = [0.16, 1, 0.3, 1] as const;
const stC = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const stI = { hidden: { opacity: 0, y: 30, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: bankyEase } } };

interface Sponsor { _id: string; name: string; logoUrl: string; website: string; tier: string; description: string; }
const tierLabels: Record<string, string> = { title: 'Title Sponsors', gold: 'Gold Sponsors', silver: 'Silver Sponsors', community: 'Community Partners' };
const tierOrder = ['title', 'gold', 'silver', 'community'];

export default function Partners() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const r = await fetch('/api/content/sponsors'); if (r.ok) setSponsors(await r.json()); } catch {} setLoading(false); })(); }, []);
  const grouped = tierOrder.map(t => ({ tier: t, label: tierLabels[t], items: sponsors.filter(s => s.tier === t) })).filter(g => g.items.length > 0);

  return (
    <div className="min-h-screen bg-white pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: bankyEase }} className="mb-14">
          <p className="text-amber-600 text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-amber-600 inline-block" />Ecosystem
          </p>
          <h1 className="text-3xl md:text-[44px] font-display font-bold text-banky-dark mb-4 leading-tight">
            <BankyTextReveal text="Strategic Partners" by="char" delay={0.08} />
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-banky-dark/50 text-[16px] max-w-2xl">Collaborating to build a robust startup ecosystem in North Malabar.</motion.p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-banky-border border-t-banky-blue rounded-full animate-spin" /></div>
        ) : grouped.length > 0 ? (
          <div className="space-y-12">
            {grouped.map((group, gIdx) => (
              <motion.div key={group.tier} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: gIdx * 0.1, ease: bankyEase }}>
                <h2 className="text-[13px] font-semibold text-banky-blue uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <span className="w-4 h-px bg-banky-blue inline-block" />{group.label}
                </h2>
                <motion.div variants={stC} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((s) => (
                    <motion.div key={s._id} variants={stI} className="card-hover p-6 banky-card group">
                      <h3 className="text-[15px] font-semibold text-banky-dark group-hover:text-banky-blue transition-colors duration-300">{s.name}</h3>
                      {s.website && <a href={s.website} target="_blank" rel="noreferrer" className="text-[12px] text-banky-blue hover:underline">{s.website.replace(/https?:\/\//, '')}</a>}
                      {s.description && <p className="text-[13px] text-banky-dark/50 leading-relaxed mt-2">{s.description}</p>}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: bankyEase }} className="text-center py-12">
            <div className="w-16 h-16 bg-banky-blue/[0.06] border border-banky-blue/15 flex items-center justify-center mx-auto mb-5">
              <Handshake className="w-7 h-7 text-banky-blue" />
            </div>
            <h2 className="text-xl font-display font-bold text-banky-dark mb-3">Partnership announcements coming soon</h2>
            <p className="text-[15px] text-banky-dark/50 max-w-md mx-auto mb-8">We are actively onboarding ecosystem partners.</p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-[14px]">
              Partner With Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: bankyEase }}
          className="banky-card p-7 md:p-10 mt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="text-lg font-display font-semibold text-banky-dark mb-1">Become a Partner</h3>
            <p className="text-[14px] text-banky-dark/50 max-w-md">Interested in partnering with the Coastal Innovation Summit?</p>
          </div>
          <a href="mailto:contact@buildupkasaragod.org" className="btn-primary shrink-0 inline-flex items-center gap-2 px-6 py-3 font-semibold text-[14px]">
            <Mail className="w-4 h-4" /> Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}
