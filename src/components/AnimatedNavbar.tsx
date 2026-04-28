import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const bankyEase = [0.16, 1, 0.3, 1] as const;

export default function AnimatedNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Sessions', path: '/sessions' },
    { name: 'Speakers', path: '/speakers' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: bankyEase }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-2xl border-b border-gray-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 lg:px-8 h-[72px] flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="z-50 flex items-center gap-2.5 group">
            <img
              src="/logo.avif"
              alt="CIS"
              className="h-9 w-9 object-cover rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-105"
              style={{ mixBlendMode: 'multiply' }}
              width={36}
              height={36}
              loading="eager"
              decoding="async"
            />
            <div className="hidden sm:block leading-tight">
              <p className="text-[14px] font-display font-bold text-banky-dark tracking-tight">Coastal Innovation Summit</p>
              <p className="text-[11px] text-banky-dark/40 -mt-0.5 tracking-wide">Kasaragod, Kerala · 2026</p>
            </div>
          </Link>

          {/* Doodle arrow pointing to logo — desktop only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: bankyEase }}
            className="hidden lg:flex items-center -ml-1"
          >
            <svg width="100" height="45" viewBox="0 0 100 45" fill="none" className="text-white -mr-1">
              {/* Loopy doodle arrow — curls down, loops, then arrowhead points left toward logo */}
              <motion.path
                d="M92 38 C82 42, 72 35, 65 28 C58 20, 55 10, 48 8 C40 6, 38 18, 42 24 C46 30, 38 32, 32 28 C26 24, 22 18, 16 14 C12 12, 8 10, 5 12"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.4, duration: 1.2, ease: bankyEase }}
              />
              {/* Arrowhead */}
              <motion.path
                d="M10 7 L4 13 L11 16"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.4, duration: 0.3, ease: bankyEase }}
              />
            </svg>
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.6, duration: 0.5, ease: bankyEase }}
              className="text-white text-[11px] font-display font-bold uppercase tracking-[0.2em]"
            >
              Home
            </motion.span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: bankyEase }}
              >
                <Link to={link.path}
                  className={`relative text-[14px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 hover-underline ${
                    isActive(link.path)
                      ? 'text-banky-blue'
                      : 'text-banky-dark/70 hover:text-banky-dark'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-banky-blue rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: bankyEase }}
            >
              <Link to="/contact" className="text-[14px] font-medium uppercase tracking-[0.08em] text-banky-dark/70 hover:text-banky-dark transition-colors duration-300 hover-underline">Contact</Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: bankyEase }}
            >
              <Link to="/register"
                className="btn-primary px-6 py-2.5 text-[14px] font-semibold rounded-full"
              >
                Register →
              </Link>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden z-50 p-2 -mr-2 text-banky-dark" onClick={() => setIsOpen(true)} aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: bankyEase }}
            className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-xs z-[70] bg-white flex flex-col shadow-2xl border-l border-banky-border/30"
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-banky-border/40">
              <p className="text-[15px] font-display font-bold text-banky-dark">Menu</p>
              <button className="p-2 text-banky-gray hover:text-banky-dark transition-colors" onClick={close} aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col px-5 py-6 flex-1 overflow-y-auto">
              <Link to="/" onClick={close} className={`py-3.5 text-[16px] font-medium border-b border-banky-border/30 transition-colors ${isActive('/') ? 'text-banky-blue' : 'text-banky-dark'}`}>Home</Link>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: bankyEase }}
                >
                  <Link to={link.path} onClick={close}
                    className={`block py-3.5 text-[16px] font-medium border-b border-banky-border/30 transition-colors ${isActive(link.path) ? 'text-banky-blue' : 'text-banky-dark'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <Link to="/contact" onClick={close} className={`py-3.5 text-[16px] font-medium border-b border-banky-border/30 transition-colors ${isActive('/contact') ? 'text-banky-blue' : 'text-banky-dark'}`}>Contact</Link>
            </nav>

            <div className="px-5 pb-6">
              <Link to="/register" onClick={close} className="btn-primary block w-full py-3.5 text-center font-semibold text-[15px] rounded-full">
                Register Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
