import { Link } from 'react-router-dom';
import { Mail, MapPin, Globe, Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const bankyEase = [0.16, 1, 0.3, 1] as const;
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const staggerChild = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: bankyEase } } };

export default function Footer() {
  return (
    <footer className="bg-banky-dark text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-16 pb-12 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
        >
          {/* Brand column */}
          <motion.div variants={staggerChild} className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <img src="/logo.avif" alt="CIS" className="h-9 w-9 object-cover rounded-xl transition-transform duration-500 group-hover:scale-110" style={{ mixBlendMode: 'screen' }} width={36} height={36} loading="lazy" decoding="async" />
              <div>
                <p className="text-[14px] font-display font-bold text-white leading-tight">Coastal Innovation Summit</p>
                <p className="text-[11px] text-white/40 leading-tight">Kasaragod, Kerala · 2026</p>
              </div>
            </Link>
            <p className="text-[13px] leading-relaxed text-white/40 max-w-[260px] mb-5">
              A structured, beginner-friendly startup learning experience for the North Malabar region.
            </p>
            <div className="flex items-center gap-1">
              {[
                { href: 'https://www.instagram.com/buildupkasaragod/', icon: Instagram, label: 'Instagram' },
                { href: 'https://www.linkedin.com/company/build-up-kasaragod/', icon: Linkedin, label: 'LinkedIn' },
                { href: 'mailto:contact@buildupkasaragod.org', icon: Mail, label: 'Email' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={s.label}
                    className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-banky-blue-light rounded-lg hover:bg-banky-blue/[0.08] transition-all duration-500">
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Navigate */}
          <motion.div variants={staggerChild}>
            <h4 className="text-[12px] font-semibold text-white/50 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-banky-blue inline-block" />
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {[{ l: 'Home', p: '/' }, { l: 'About', p: '/about' }, { l: 'Events', p: '/events' }, { l: 'Sessions', p: '/sessions' }, { l: 'Speakers', p: '/speakers' }, { l: 'Partners', p: '/partners' }, { l: 'FAQ', p: '/faq' }].map((link) => (
                <li key={link.p}><Link to={link.p} className="text-[13px] text-white/40 hover:text-banky-blue-light transition-colors duration-300">{link.l}</Link></li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={staggerChild}>
            <h4 className="text-[12px] font-semibold text-white/50 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-banky-blue inline-block" />
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-white/25 mt-1 shrink-0" />
                <a href="mailto:contact@buildupkasaragod.org" className="text-[13px] text-white/40 hover:text-banky-blue-light transition-colors duration-300 break-words">contact@buildupkasaragod.org</a>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-3.5 h-3.5 text-white/25 mt-1 shrink-0" />
                <a href="https://www.buildupkasaragod.org" target="_blank" rel="noreferrer" className="text-[13px] text-white/40 hover:text-banky-blue-light transition-colors duration-300">buildupkasaragod.org</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-white/25 mt-1 shrink-0" />
                <span className="text-[13px] text-white/40">Lancof, CH Building Complex,<br />Neerchal, Kasaragod – 671323</span>
              </li>
            </ul>
          </motion.div>

          {/* Event */}
          <motion.div variants={staggerChild}>
            <h4 className="text-[12px] font-semibold text-white/50 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-banky-blue inline-block" />
              Event
            </h4>
            <div className="bg-white/[0.06] p-4 rounded-xl mb-4 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-1">
                <span className="blue-dot" />
                <span className="text-white/70 font-medium text-[13px]">Details coming soon</span>
              </div>
              <p className="text-[12px] text-white/35">Date and venue will be announced shortly.</p>
            </div>
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-[13px] font-semibold rounded-full">
              Register Now <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/25">© 2026 Coastal Innovation Summit. All rights reserved.</p>
          <p className="text-[11px] text-white/25">Organized by <a href="https://www.buildupkasaragod.org" target="_blank" rel="noreferrer" className="text-white/40 hover:text-banky-blue-light transition-colors duration-300">BuildUp Kasaragod</a></p>
        </div>
      </div>
    </footer>
  );
}
