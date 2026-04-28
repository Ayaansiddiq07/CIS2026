import { useRef, useEffect, useState } from 'react';

type BankyTextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  by?: 'word' | 'char';
  /** If true, only triggers when scrolled into view (default: false = triggers on mount) */
  scrollTriggered?: boolean;
};

/**
 * Optimized text reveal — uses CSS animations instead of per-element framer-motion.
 * All animation runs on the compositor thread (GPU), zero JS per frame.
 */
export default function BankyTextReveal({
  text,
  className = '',
  delay = 0,
  by = 'word',
  scrollTriggered = false,
}: BankyTextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(!scrollTriggered);

  useEffect(() => {
    if (!scrollTriggered) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-60px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollTriggered]);

  const items = by === 'char' ? [...text] : text.split(' ');
  const stagger = by === 'char' ? 0.03 : 0.08;

  return (
    <span ref={ref} className={className} style={{ whiteSpace: 'nowrap' }}>
      {items.map((item, index) => {
        const isSpace = item === ' ';
        const chunk = by === 'char' ? (isSpace ? '\u00A0' : item) : `${item}\u00A0`;

        return (
          <span key={`${item}-${index}`} className="inline-block overflow-hidden align-top">
            <span
              className="inline-block banky-text-unit"
              style={{
                animationDelay: `${delay + index * stagger}s`,
                animationPlayState: visible ? 'running' : 'paused',
              }}
            >
              {chunk}
            </span>
          </span>
        );
      })}
    </span>
  );
}
