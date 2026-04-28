import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Calendar, Podcast, Users } from 'lucide-react';

const bankyEase = [0.16, 1, 0.3, 1] as const;
const staggerC = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const staggerI = { hidden: { opacity: 0, y: 40, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: bankyEase } } };

interface Speaker { _id: string; name: string; organization?: string; bio: string; topic: string; }

export default function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const r = await fetch('/api/content/speakers'); if (r.ok) setSpeakers(await r.json()); } catch {} setLoading(false); })(); }, []);

  return (
    <div className="min-h-screen bg-white pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: bankyEase }} className="mb-14">
          <p className="text-purple-600 text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-purple-600 inline-block" />Lineup
          </p>
          <h1 className="text-3xl md:text-[44px] font-display font-bold text-banky-dark mb-4 leading-tight">Featured Speakers</h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-banky-dark/50 text-[16px] max-w-2xl">Experienced founders sharing practical realities, failures, and scaling constraints.</motion.p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-banky-border border-t-banky-blue rounded-full animate-spin" /></div>
        ) : speakers.length > 0 ? (
          <motion.div variants={staggerC} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {speakers.map((s) => (
              <motion.div key={s._id} variants={staggerI} className="card-hover p-6 banky-card group">
                <div className="w-12 h-12 bg-banky-blue/[0.08] border border-banky-blue/15 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
                  <span className="text-banky-blue font-display font-bold text-[16px]">{s.name.charAt(0)}</span>
                </div>
                <h3 className="text-[16px] font-semibold text-banky-dark mb-0.5 group-hover:text-banky-blue transition-colors duration-300">{s.name}</h3>
                {s.organization && <p className="text-[12px] text-banky-dark/40 mb-2">{s.organization}</p>}
                <p className="text-[13px] text-banky-blue font-medium mb-2">{s.topic}</p>
                <p className="text-[13px] text-banky-dark/50 leading-relaxed line-clamp-3">{s.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: bankyEase }} className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-white/50 border border-banky-border/30 flex items-center justify-center mx-auto mb-5">
              <Mic className="w-7 h-7 text-banky-blue" />
            </div>
            <h2 className="text-xl font-display font-bold text-banky-dark mb-3">Speaker lineup coming soon</h2>
            <p className="text-[15px] text-banky-dark/50 max-w-md mx-auto mb-10">We are curating industry practitioners and regional founders.</p>
            <div className="flex justify-center gap-14">
              {[
                { val: '7+', label: 'Sessions', icon: Calendar },
                { val: '8', label: 'Speakers', icon: Users },
                { val: '1', label: 'Podcast', icon: Podcast },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: bankyEase }}
                  className="text-center"
                >
                  <span className="font-display font-bold text-2xl text-gradient block">{stat.val}</span>
                  <span className="text-[12px] text-banky-dark/40 uppercase tracking-[0.15em]">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
