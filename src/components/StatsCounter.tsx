import { useEffect, useRef } from 'react';
import { useInView, animate, motion } from 'framer-motion';

const bankyEase = [0.16, 1, 0.3, 1] as const;

const stats = [
  { label: 'Expected Attendees', value: 300, suffix: '+' },
  { label: 'Speakers', value: 8, suffix: '' },
  { label: 'Sessions', value: 7, suffix: '' },
  { label: 'Activity Zones', value: 5, suffix: '' },
];

export function Counter({ from, to, suffix }: { from: number; to: number; suffix: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(from, to, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate(value: number) {
        node.textContent = Intl.NumberFormat('en-US').format(Math.round(value)) + suffix;
      },
    });
    return () => controls.stop();
  }, [from, to, suffix, inView]);

  return <span ref={nodeRef} className="text-4xl lg:text-[56px] font-display font-bold text-banky-blue counter-glow" />;
}

export default function StatsCounter() {
  return (
    <div className="w-full py-24 md:py-28 relative overflow-hidden">
      {/* Top/bottom lines */}
      <div className="section-line w-full mb-12" />
      <div className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: bankyEase } }
              }}
              className="text-center lg:text-left"
            >
              <Counter from={0} to={stat.value} suffix={stat.suffix} />
              <span className="text-[13px] text-banky-dark/40 block mt-3 uppercase tracking-[0.15em]">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="section-line w-full mt-12" />
    </div>
  );
}
