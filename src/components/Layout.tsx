import { useEffect, useRef, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNavbar from './AnimatedNavbar.tsx';
import Footer from './Footer.tsx';

export default function Layout() {
  const location = useLocation();
  const progressRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  /** Update scroll bar via direct DOM manipulation — zero React re-renders */
  const updateProgress = useCallback(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0;
    bar.style.width = `${pct}%`;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [location.pathname, updateProgress]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="scroll-progress-wrap" aria-hidden="true">
        <div ref={progressRef} className="scroll-progress-bar" style={{ width: '0%' }} />
      </div>
      <AnimatedNavbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
