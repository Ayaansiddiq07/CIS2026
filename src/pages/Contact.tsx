import { motion } from 'framer-motion';
import { Mail, MapPin, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-surface pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-display font-black text-brand-ocean tracking-tight uppercase mb-4">
            Contact <span className="text-brand-accent">Us</span>
          </h1>
          <p className="text-[15px] text-slate-600 font-medium mb-10">
            Have questions about the Coastal Innovation Summit? Reach out to us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 bg-slate-200">
            <div className="bg-white p-6 md:p-8 flex flex-col gap-3">
              <Mail className="w-5 h-5 text-brand-accent" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Email</h3>
              <a href="mailto:contact@buildupkasaragod.org" className="text-[15px] text-slate-600 font-medium hover:text-brand-accent transition-colors break-all">
                contact@buildupkasaragod.org
              </a>
            </div>
            <div className="bg-white p-6 md:p-8 flex flex-col gap-3 border-t border-slate-200 md:border-t-0 md:border-l">
              <Globe className="w-5 h-5 text-brand-accent" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Website</h3>
              <a href="https://www.buildupkasaragod.org" target="_blank" rel="noreferrer" className="text-[15px] text-slate-600 font-medium hover:text-brand-accent transition-colors">
                buildupkasaragod.org
              </a>
            </div>
            <div className="bg-white p-6 md:p-8 flex flex-col gap-3 border-t border-slate-200 md:border-t-0 md:border-l">
              <MapPin className="w-5 h-5 text-brand-accent" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Address</h3>
              <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
                Lancof, First Floor, CH Building Complex, Neerchal, Kasaragod – 671323
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}