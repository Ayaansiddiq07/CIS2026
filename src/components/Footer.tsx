import { Link } from 'react-router-dom';
import { Mail, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-sm text-slate-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="inline-block mb-6 bg-white rounded-full p-2 shadow-lg">
            <img src="/logo.avif" alt="Coastal Innovation Summit" className="h-[60px] w-[60px] object-cover rounded-full" />
          </Link>
          <p className="mt-2 text-slate-400 leading-relaxed font-sans pr-4 font-medium">
            Coastal Innovation Summit: A structured, beginner-friendly, zero-fluff learning experience.
          </p>
        </div>

        <div>
          <h4 className="font-display font-black text-white text-xs uppercase tracking-[0.4em] mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link to="/about" className="hover:text-brand-accent transition-colors font-medium">About Conclave</Link></li>
            <li><Link to="/sessions" className="hover:text-brand-accent transition-colors font-medium">Schedule & Zones</Link></li>
            <li><Link to="/speakers" className="hover:text-brand-accent transition-colors font-medium">Our Speakers</Link></li>
            <li><Link to="/partners" className="hover:text-brand-accent transition-colors font-medium">Partners</Link></li>
            <li><Link to="/contact" className="hover:text-brand-accent transition-colors font-medium">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-black text-white text-xs uppercase tracking-[0.4em] mb-6">Connect</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-brand-accent mt-1 shrink-0" />
              <a href="mailto:contact@buildupkasaragod.org" className="hover:text-brand-accent transition-colors font-medium break-all">contact@buildupkasaragod.org</a>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-brand-accent mt-1 shrink-0" />
              <a href="https://www.buildupkasaragod.org" target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors font-medium break-all">buildupkasaragod.org</a>
            </li>
            <li className="flex items-start gap-3 mt-4">
              <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-1" />
              <span className="font-medium text-[13px] md:text-sm leading-relaxed">Lancof, First Floor, CH Building Complex, Neerchal, Kasaragod – 671323</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-black text-white text-xs uppercase tracking-[0.4em] mb-6">Location & Date</h4>
          <p className="text-slate-400 leading-relaxed font-medium">
            <strong className="text-brand-accent text-lg">May 10, 2026</strong><br/>
            Govinda Pai Smarakam<br/>
            Bhavanika Auditorium<br/>
            Manjeshwar, Kasaragod, Kerala
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-relaxed">
          © 2026 Coastal Innovation Summit. All rights reserved.
        </p>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          Organized by BuildUp Kasaragod
        </p>
      </div>
    </footer>
  );
}
