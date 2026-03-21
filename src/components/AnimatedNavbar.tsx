import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function AnimatedNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  const desktopLinks = [
    { name: 'About', path: '/about' },
    { name: 'Sessions', path: '/sessions' },
    { name: 'Speakers', path: '/speakers' },
    { name: 'Partners', path: '/partners' },
  ];

  const drawerLinks = [
    { name: 'About', path: '/about' },
    { name: 'Sessions', path: '/sessions' },
    { name: 'Speakers', path: '/speakers' },
    { name: 'Register', path: '/register' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-[background,padding,box-shadow] duration-200 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm py-3 shadow-sm' : 'bg-white/80 py-4'
        }`}
      >
        {/* Colorful gradient border line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-accent via-brand-red to-amber-500" />

        <div className="max-w-7xl mx-auto px-5 lg:px-12 flex items-center justify-between">
          <Link to="/" className="z-50 shrink-0 bg-white rounded-full p-1 shadow-md group transition-shadow duration-300 hover:shadow-lg hover:shadow-brand-accent/20">
            <img
              src="/logo.avif"
              alt="CIS"
              className="h-[42px] w-[42px] md:h-[50px] md:w-[50px] object-cover rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              width={50}
              height={50}
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {desktopLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-150 ${
                  location.pathname === link.path
                    ? 'text-brand-accent border-2 border-brand-accent'
                    : 'text-slate-700 hover:text-brand-accent border-2 border-transparent hover:border-brand-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/register"
              className="ml-2 px-6 py-2.5 bg-brand-accent hover:bg-teal-600 text-white rounded-full font-semibold text-sm transition-colors duration-150"
            >
              Register
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden z-50 p-2 text-slate-800 -mr-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer — Pure CSS transitions for max performance */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-[80vw] max-w-xs z-[70] bg-white flex flex-col pt-16 pb-10 px-6 shadow-2xl transition-transform duration-250 ease-out will-change-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-5 right-5 p-2 text-slate-700 hover:text-brand-accent transition-colors"
          onClick={close}
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="flex flex-col gap-1 mt-6">
          {drawerLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={close}
              className={`py-3.5 px-3 text-lg font-display font-bold transition-colors duration-100 border-b border-slate-100 ${
                location.pathname === link.path
                  ? 'text-brand-accent'
                  : 'text-slate-800 active:text-brand-accent'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/register"
            onClick={close}
            className="mt-4 py-3.5 bg-brand-ocean text-white text-center font-bold tracking-wider uppercase text-sm active:bg-brand-red transition-colors"
          >
            Register Now
          </Link>
        </nav>

        <div className="flex gap-6 mt-auto pt-8 border-t border-slate-100">
          <Link to="/contact" onClick={close} className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Contact</Link>
          <Link to="/faq" onClick={close} className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">FAQ</Link>
        </div>
      </div>
    </>
  );
}
