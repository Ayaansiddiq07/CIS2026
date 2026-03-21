import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-brand-surface pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-display font-black text-brand-ocean tracking-tight uppercase mb-4">
            Executive <span className="text-brand-accent">Summary</span>
          </h1>
          
          <div className="prose prose-base text-[15px] leading-relaxed text-slate-600 font-medium mb-12">
            <p className="mb-4">
              The Coastal Innovation Summit is well-structured, credible, and purpose-built. It is not positioned to compete in scale with flagship startup festivals. Instead, it fills a critical gap by serving Tier-2 and Tier-3 regions with a structured, beginner-friendly, zero-fluff startup learning experience.
            </p>
            <p>
              This summit is designed as a focused, education-first startup event aimed primarily at first-time learners and early-stage founders from the North Malabar region. The objective is clarity, seriousness, and practical value, not scale for appearance.
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-black text-brand-ocean uppercase mb-4 border-b border-slate-200 pb-3">
            Venue & <span className="text-brand-red">Significance</span>
          </h2>
          <div className="bg-white p-6 md:p-8 rounded-none border border-slate-200 mb-12">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Govinda Pai Smarakam Bhavanika Auditorium</h3>
            <p className="text-sm text-brand-accent font-bold mb-4 uppercase tracking-widest">Manjeshwar, Kasaragod</p>
            <p className="text-[15px] leading-relaxed text-slate-600 mb-4">
              The venue is part of the Gilivindu Project, developed jointly by the Governments of Kerala and Karnataka as a national-level centre of literature, culture, and research.
            </p>
            <p className="text-[15px] leading-relaxed text-slate-600">
              <strong>Why This Venue Matters:</strong> Govinda Pai Smarakam is a culturally and historically significant landmark in Kasaragod. Hosting the Startup Conclave here sends a clear message that innovation and entrepreneurship belong to this region's legacy. Choosing this venue aligns the conclave with regional pride, intellectual heritage, and long-term ecosystem building.
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-black text-brand-ocean uppercase mb-4 border-b border-slate-200 pb-3">
            Audience <span className="text-brand-accent">Profile</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 bg-slate-200 mb-12">
            <div className="bg-white p-6 lg:p-8 hover:bg-slate-50 transition-colors">
              <span className="text-brand-accent font-display font-black text-2xl mb-3 block border-b-2 border-brand-accent pb-2 inline-block">01</span>
              <h3 className="text-[15px] font-bold text-slate-900 mb-2 uppercase">First-time Learners</h3>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">Accessible entry points into the startup ecosystem for absolute beginners.</p>
            </div>
            <div className="bg-white p-6 lg:p-8 hover:bg-slate-50 transition-colors border-t border-slate-200 md:border-t-0 md:border-l">
              <span className="text-brand-red font-display font-black text-2xl mb-3 block border-b-2 border-brand-red pb-2 inline-block">02</span>
              <h3 className="text-[15px] font-bold text-slate-900 mb-2 uppercase">Early Founders</h3>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">Practical guidance for navigating early execution challenges effectively.</p>
            </div>
            <div className="bg-white p-6 lg:p-8 hover:bg-slate-50 transition-colors border-t border-slate-200 md:border-t-0 md:border-l">
              <span className="text-brand-ocean font-display font-black text-2xl mb-3 block border-b-2 border-brand-ocean pb-2 inline-block">03</span>
              <h3 className="text-[15px] font-bold text-slate-900 mb-2 uppercase">Experienced Pros</h3>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">Networking, insights, and critical regional ecosystem building.</p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-black text-brand-ocean uppercase mb-4 border-b border-slate-200 pb-3">
            Outcome & <span className="text-brand-accent">Value</span>
          </h2>
          <div className="bg-brand-ocean p-6 sm:p-10 lg:p-12 mb-8 md:mb-12 text-white">
            <h3 className="text-2xl font-display font-bold mb-8 text-brand-accent uppercase tracking-wide">Designed to deliver meaningful value</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="border-l-2 border-brand-red pl-6">
                <span className="text-brand-red text-xs font-bold tracking-widest uppercase block mb-2">Value 01</span>
                <p className="font-medium text-slate-300">Support active learning through direct participation and hands-on experiences.</p>
              </div>
              <div className="border-l-2 border-brand-accent pl-6">
                <span className="text-brand-accent text-xs font-bold tracking-widest uppercase block mb-2">Value 02</span>
                <p className="font-medium text-slate-300">Encourage confidence, collaboration, and entrepreneurial thinking.</p>
              </div>
              <div className="border-l-2 border-brand-accent pl-6">
                <span className="text-brand-accent text-xs font-bold tracking-widest uppercase block mb-2">Value 03</span>
                <p className="font-medium text-slate-300">Showcase regional culture, tribal heritage, and local inclusiveness.</p>
              </div>
              <div className="border-l-2 border-brand-red pl-6">
                <span className="text-brand-red text-xs font-bold tracking-widest uppercase block mb-2">Value 04</span>
                <p className="font-medium text-slate-300">Create memorable experiences that extend the impact of the summit beyond the main stage.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}