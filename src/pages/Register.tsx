import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Shield, Star, Users, Store } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export default function Register() {
  return (
    <div className="min-h-screen bg-brand-surface pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-block py-1 px-4 border border-brand-accent text-brand-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            Passes Now Available
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-brand-ocean tracking-tight uppercase mb-4">
            CHOOSE YOUR <span className="text-brand-accent">EXPERIENCE</span>
          </h1>
          <p className="text-slate-600 font-medium text-base max-w-xl mx-auto">
            Select the delegate pass that best fits your goals for the Coastal Innovation Summit.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Gold Delegate */}
          <motion.div variants={cardVariants} className="bg-white p-6 border border-slate-200 hover:border-brand-accent hover:shadow-xl transition-all relative flex flex-col group">
            <div className="w-10 h-10 bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-brand-accent transition-colors">
              <Star className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 uppercase tracking-wide mb-1">Gold Delegate</h3>
            <p className="text-[13px] text-slate-500 font-medium mb-6">Standard individual access pass for lean founders and students.</p>
            <div className="mb-6">
              <span className="text-3xl font-black text-brand-ocean">₹499</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">/Person</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> Full Access to Main Stage</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> Access to Activity Zones</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> Standard Networking</li>
            </ul>
            <button className="w-full py-3 text-center font-bold text-xs uppercase tracking-widest bg-brand-ocean text-white hover:bg-brand-accent transition-colors">Select Gold</button>
          </motion.div>

          {/* Diamond Delegate */}
          <motion.div variants={cardVariants} className="bg-brand-ocean p-6 border border-brand-accent shadow-[0_10px_40px_rgba(13,162,146,0.15)] relative flex flex-col transform md:-translate-y-4 z-10 group">
            <div className="absolute top-0 right-0 bg-brand-accent text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 m-3">Most Popular</div>
            <div className="w-10 h-10 bg-white/10 flex items-center justify-center mb-5">
              <Shield className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold font-display text-white uppercase tracking-wide mb-1">Diamond VIP</h3>
            <p className="text-[13px] text-slate-400 font-medium mb-6">Premium experience for investors and established pros.</p>
            <div className="mb-6">
              <span className="text-3xl font-black text-white">₹1,499</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">/Person</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-200"><Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> Priority Seating on Main Stage</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-200"><Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> VIP Networking Lounge Access</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-200"><Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> Private Speaker Q&A</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-200"><Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> Exclusive Merchandise</li>
            </ul>
            <button className="w-full py-3 text-center font-bold text-xs uppercase tracking-widest bg-brand-accent text-white hover:bg-white hover:text-brand-ocean transition-colors">Select Diamond</button>
          </motion.div>

          {/* Bulk Registration */}
          <motion.div variants={cardVariants} className="bg-white p-6 border border-slate-200 hover:border-brand-accent hover:shadow-xl transition-all relative flex flex-col group">
            <div className="w-10 h-10 bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-brand-red transition-colors">
              <Users className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 uppercase tracking-wide mb-1">Bulk Pass</h3>
            <p className="text-[13px] text-slate-500 font-medium mb-6">Designed for institutions, colleges, and corporate teams.</p>
            <div className="mb-6">
              <span className="text-3xl font-black text-brand-ocean">₹3,999</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">/10 Passes</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" /> 10x Gold Delegate Passes</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" /> Fast-track Group Registration</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" /> Dedicated POC Assistance</li>
            </ul>
            <button className="w-full py-3 text-center font-bold text-xs uppercase tracking-widest bg-brand-ocean text-white hover:bg-brand-red transition-colors">Select Bulk</button>
          </motion.div>

          {/* Stall Registration */}
          <motion.div variants={cardVariants} className="bg-white p-6 border border-slate-200 hover:border-brand-accent hover:shadow-xl transition-all relative flex flex-col group">
            <div className="w-10 h-10 bg-slate-100 flex items-center justify-center mb-5 transition-colors group-hover:bg-brand-ocean">
              <Store className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 uppercase tracking-wide mb-1">Stall Space</h3>
            <p className="text-[13px] text-slate-500 font-medium mb-6">Showcase your startup, rural enterprise, or tech project.</p>
            <div className="mb-6">
              <span className="text-3xl font-black text-brand-ocean">₹4,999</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">/Booth</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-ocean shrink-0 mt-0.5" /> 3x3 Meter Premium Stall Space</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-ocean shrink-0 mt-0.5" /> 2x Exhibitor Passes</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-ocean shrink-0 mt-0.5" /> Logo in Partner Directory</li>
              <li className="flex items-start gap-2 text-[13px] font-medium text-slate-700"><Check className="w-4 h-4 text-brand-ocean shrink-0 mt-0.5" /> Pitch Opportunity</li>
            </ul>
            <button className="w-full py-3 text-center font-bold text-xs uppercase tracking-widest bg-slate-200 text-slate-800 hover:bg-brand-ocean hover:text-white transition-colors">Book Stall</button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 font-medium">Need something custom or have sponsorship questions?</p>
          <Link to="/contact" className="inline-block mt-4 font-bold text-brand-accent hover:text-brand-ocean tracking-wide underline decoration-2 underline-offset-4">Contact Organizers</Link>
        </motion.div>
      </div>
    </div>
  );
}