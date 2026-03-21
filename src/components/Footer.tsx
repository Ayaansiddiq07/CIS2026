import { Link } from 'react-router-dom';
import { Mail, MapPin, Globe, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-ocean text-slate-400">
      {/* Top: gradient accent line */}
      <div className="h-[3px] bg-gradient-to-r from-brand-accent via-brand-red to-amber-500" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 pt-12 pb-10">
        {/* Upper row: Logo + Nav + Contact + Event */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.avif"
                alt="Coastal Innovation Summit"
                className="h-12 w-12 object-cover rounded-full bg-white p-0.5 shadow"
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-400 max-w-[260px]">
              A structured, beginner-friendly, zero-fluff startup learning experience for the North Malabar region.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.instagram.com/buildupkasaragod/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-500 hover:text-brand-accent hover:border-brand-accent transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/build-up-kasaragod/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-500 hover:text-brand-accent hover:border-brand-accent transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@buildupkasaragod.org"
                aria-label="Email"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-500 hover:text-brand-accent hover:border-brand-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-[11px] uppercase tracking-[0.3em] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About', path: '/about' },
                { label: 'Sessions', path: '/sessions' },
                { label: 'Speakers', path: '/speakers' },
                { label: 'Partners', path: '/partners' },
                { label: 'Register', path: '/register' },
                { label: 'FAQ', path: '/faq' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[13px] text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-display font-bold text-white text-[11px] uppercase tracking-[0.3em] mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <a
                  href="mailto:contact@buildupkasaragod.org"
                  className="text-[13px] hover:text-white transition-colors break-words"
                >
                  contact@buildupkasaragod.org
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <a
                  href="https://www.buildupkasaragod.org"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] hover:text-white transition-colors"
                >
                  buildupkasaragod.org
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <span className="text-[13px] leading-relaxed">
                  Lancof, First Floor, CH Building Complex,<br />
                  Neerchal, Kasaragod – 671323
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Event Info */}
          <div>
            <h4 className="font-display font-bold text-white text-[11px] uppercase tracking-[0.3em] mb-5">
              Event
            </h4>
            <div className="space-y-3 text-[13px]">
              <p>
                <span className="text-brand-accent font-bold text-base block mb-0.5">May 10, 2026</span>
                Saturday · 08:00 AM – 05:30 PM
              </p>
              <p className="leading-relaxed">
                Govinda Pai Smarakam<br />
                Bhavanika Auditorium<br />
                Manjeshwar, Kasaragod, Kerala
              </p>
            </div>

            <Link
              to="/register"
              className="inline-block mt-5 px-5 py-2.5 bg-brand-accent text-white text-[11px] font-bold uppercase tracking-widest hover:bg-teal-600 transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 font-medium">
            © 2026 Coastal Innovation Summit. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 font-medium">
            Organized by <a href="https://www.buildupkasaragod.org" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-accent transition-colors">BuildUp Kasaragod</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
