import { motion } from 'framer-motion';

export default function Speakers() {
  return (
    <div className="min-h-screen bg-brand-surface pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-display font-black text-brand-ocean tracking-tight uppercase">
            Featured <span className="text-brand-accent">Speakers</span>
          </h1>
          <p className="text-slate-600 mt-4 text-[15px] md:text-base max-w-2xl mx-auto font-medium">
            Experienced founders and professionals sharing practical realities, failures, and scaling constraints.
          </p>
        </motion.div>

        <div className="bg-white border-2 border-slate-200 p-8 md:p-12 text-center">
          <div className="text-brand-accent font-display font-black text-6xl md:text-8xl opacity-20 mb-4">TBA</div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-3">
            Speaker Lineup Coming Soon
          </h2>
          <p className="text-[15px] text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
            Our speaker lineup is being finalized. We are curating industry practitioners, regional founders, and domain experts who have built and scaled ventures from Tier-2 and Tier-3 regions.
          </p>
          <div className="mt-8 border-t border-slate-200 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="border border-slate-200 p-4">
              <span className="text-brand-red font-display font-black text-2xl block mb-1">7+</span>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Sessions Planned</span>
            </div>
            <div className="border border-slate-200 p-4">
              <span className="text-brand-accent font-display font-black text-2xl block mb-1">8</span>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Speakers Expected</span>
            </div>
            <div className="border border-slate-200 p-4">
              <span className="text-brand-ocean font-display font-black text-2xl block mb-1">1</span>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Live Podcast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}