import { motion } from 'framer-motion';

export default function Partners() {
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
            Strategic <span className="text-brand-accent">Partners</span>
          </h1>
          <p className="text-slate-600 mt-4 text-[15px] md:text-base max-w-2xl mx-auto font-medium">
            Collaborating to build a robust startup ecosystem in North Malabar.
          </p>
        </motion.div>

        <div className="bg-white border-2 border-slate-200 p-8 md:p-12 text-center mb-8">
          <div className="text-brand-ocean font-display font-black text-6xl md:text-8xl opacity-20 mb-4">TBA</div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-3">
            Partnership Announcements Coming Soon
          </h2>
          <p className="text-[15px] text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
            We are actively onboarding ecosystem partners, knowledge partners, and community organizations. Partnership details will be announced shortly.
          </p>
        </div>

        <div className="bg-brand-ocean p-6 md:p-8 text-white">
          <h3 className="text-lg font-display font-bold text-brand-accent uppercase tracking-wide mb-4">Become a Partner</h3>
          <p className="text-sm text-slate-300 font-medium mb-4">
            If your organization is interested in partnering with the Coastal Innovation Summit, reach out to us directly.
          </p>
          <a
            href="mailto:contact@buildupkasaragod.org"
            className="inline-block px-6 py-3 bg-brand-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-teal-600 transition-colors"
          >
            Contact for Partnership
          </a>
        </div>
      </div>
    </div>
  );
}