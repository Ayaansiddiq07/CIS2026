import { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

const stats = [
  { label: 'Expected Attendees', value: 300, suffix: '+' },
  { label: 'Speakers', value: 8, suffix: '' },
  { label: 'Sessions', value: 7, suffix: '' },
  { label: 'Activity Zones', value: 5, suffix: '' },
];

export function Counter({ from, to, suffix }: { from: number; to: number; suffix: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" }); // Keep useInView for triggering

  // New animation logic using 'animate'
  useEffect(() => {
    if (!inView) return; // Only animate when in view

    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate(value: number) {
        node.textContent = Intl.NumberFormat('en-US').format(Math.round(value)) + suffix; // Use Intl.NumberFormat for formatting
      },
    });

    return () => controls.stop();
  }, [from, to, suffix, inView]); // Added inView to dependencies

  return <span ref={nodeRef} className="text-4xl lg:text-5xl font-display font-black text-brand-ocean" />;
}

export default function StatsCounter() {
  return (
    <div className="w-full bg-brand-surface border-y border-slate-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 bg-white px-6 py-5 md:px-8 md:py-6 border border-slate-200 hover:border-brand-accent/50 hover:shadow-lg transition-all"
            >
              <Counter from={0} to={stat.value} suffix={stat.suffix} />
              <span className="text-[9px] md:text-[10px] text-brand-red font-bold uppercase tracking-[0.2em] mt-2">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
