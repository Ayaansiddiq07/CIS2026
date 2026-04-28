import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Lightbulb, Target, Globe, Sparkles, Users, Heart, Star } from 'lucide-react';
import BankyTextReveal from '../components/BankyTextReveal';

const bankyEase = [0.16, 1, 0.3, 1] as const;
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const staggerChild = { hidden: { opacity: 0, y: 40, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: bankyEase } } };

/* Scroll-triggered reveal */
function Reveal({ children, className = '', direction = 'up' }: { children: React.ReactNode; className?: string; direction?: 'up' | 'left' | 'right' | 'scale' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants: Record<string, { hidden: Record<string, number>; visible: Record<string, number> }> = {
    up: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div ref={ref} initial={variants[direction].hidden} animate={inView ? variants[direction].visible : {}}
      transition={{ duration: 0.9, ease: bankyEase }} className={className}>
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-banky-yellow pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: bankyEase }}>
          <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-banky-blue inline-block" />
            Overview
          </p>
          <h1 className="text-3xl md:text-[44px] font-display font-bold text-banky-dark mb-6 leading-tight">
            <BankyTextReveal text="Executive Summary" by="char" delay={0.08} />
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: bankyEase }}
            className="text-[16px] leading-relaxed text-banky-dark/60 space-y-4 mb-16"
          >
            <p>The Coastal Innovation Summit fills a critical gap by serving Tier-2 and Tier-3 regions with a structured, beginner-friendly startup learning experience.</p>
            <p>This summit is a focused, education-first startup event for first-time learners and early-stage founders from the North Malabar region.</p>
          </motion.div>
        </motion.div>

        {/* Venue */}
        <Reveal className="mb-16" direction="left">
          <p className="text-amber-600 text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-amber-600 inline-block" />
            Location
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-banky-dark mb-6">Venue & Significance</h2>
          <div className="banky-card p-6 md:p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/[0.1] border border-amber-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[15px] text-banky-dark font-medium">Venue details to be announced</p>
                <p className="text-[13px] text-banky-dark/50">Kasaragod District, Kerala</p>
              </div>
            </div>
            <p className="text-[15px] text-banky-dark/60 mb-4">The venue will be a culturally and historically significant location in Kasaragod.</p>
            <div className="bg-banky-yellow/40 p-4 rounded-xl border-l-2 border-l-amber-600">
              <p className="text-[14px] text-banky-dark/60 italic">The chosen venue will send a clear message that innovation and entrepreneurship belong to this region's legacy.</p>
            </div>
          </div>
        </Reveal>

        {/* Audience */}
        <Reveal className="mb-16" direction="right">
          <p className="text-purple-600 text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-purple-600 inline-block" />
            Who attends
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-banky-dark mb-6">Audience Profile</h2>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Lightbulb, title: 'First-time Learners', desc: 'Accessible entry points into the startup ecosystem.' },
              { icon: Target, title: 'Early Founders', desc: 'Practical guidance for execution challenges.' },
              { icon: Globe, title: 'Experienced Pros', desc: 'Networking and ecosystem building.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} variants={staggerChild} className="card-hover p-6 banky-card group relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-banky-blue/40 to-transparent" />
                  <Icon className="w-5 h-5 text-banky-blue mb-4 transition-transform duration-500 group-hover:scale-110" />
                  <h3 className="text-[15px] font-semibold text-banky-dark mb-1 group-hover:text-banky-blue transition-colors duration-300">{item.title}</h3>
                  <p className="text-[13px] text-banky-dark/50 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </Reveal>

        {/* Impact */}
        <Reveal direction="scale">
          <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-banky-blue inline-block" />
            Impact
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-banky-dark mb-6">Outcome & Value</h2>
          <div className="banky-card p-7 md:p-10 relative overflow-hidden">
            <h3 className="text-[17px] font-display font-semibold text-banky-dark mb-7">Designed to deliver meaningful value</h3>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { text: 'Support active learning through participation.', icon: Users },
                { text: 'Encourage confidence and entrepreneurial thinking.', icon: Heart },
                { text: 'Showcase regional culture and heritage.', icon: Star },
                { text: 'Create memorable experiences beyond the stage.', icon: Sparkles },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={i} variants={staggerChild} className="flex items-start gap-3 p-4 bg-banky-yellow/40 rounded-xl border border-banky-border/20 hover:border-banky-blue/20 transition-all duration-500 group">
                    <Icon className="w-4 h-4 text-banky-blue shrink-0 mt-0.5 transition-transform duration-500 group-hover:scale-110" />
                    <p className="text-banky-dark/60 text-[14px] leading-relaxed">{item.text}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}