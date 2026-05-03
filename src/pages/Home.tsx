import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Gamepad2, MessageSquare, Rocket, Store, Sparkles } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import StatsCounter from '../components/StatsCounter';
import BankyTextReveal from '../components/BankyTextReveal';


/* ── Banky-style animation variants ── */
const bankyEase = [0.16, 1, 0.3, 1] as const;

/* Scroll-triggered reveal with parallax depth */
function RevealSection({ children, className = '', direction = 'up' }: { children: React.ReactNode; className?: string; direction?: 'up' | 'left' | 'right' | 'scale' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const variants = {
    up: { hidden: { opacity: 0, y: 70 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -70 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 70 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div
      ref={ref}
      initial={variants[direction].hidden}
      animate={inView ? variants[direction].visible : {}}
      transition={{ duration: 0.9, ease: bankyEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Stagger children animation */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const staggerChild = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: bankyEase }
  }
};

/* Horizontal marquee component (Banky-style) */
function Marquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden py-6 border-y border-banky-border/40">
      <div className="animate-marquee whitespace-nowrap flex gap-12">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-banky-dark/25 text-[14px] font-bold uppercase tracking-[0.2em] flex items-center gap-4">
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-banky-blue/30" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  /* Parallax hero — GPU-optimized (transform + opacity only) */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 50]), { stiffness: 100, damping: 30, mass: 1 });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'Event',
            name: 'Coastal Innovation Summit 2026',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: { '@type': 'Place', name: 'To Be Announced', address: { '@type': 'PostalAddress', addressLocality: 'Kasaragod', addressRegion: 'Kerala', addressCountry: 'IN' } },
            organizer: { '@type': 'Organization', name: 'BuildUp Kasaragod', url: 'https://www.buildupkasaragod.org' },
            description: 'A structured, beginner-friendly startup learning experience for the North Malabar region.',
          }),
        }}
      />

    <div className="min-h-screen bg-white">

      {/* ━━━ HERO ━━━ */}
      <section ref={heroRef} className="relative w-full min-h-[100vh] flex items-center overflow-hidden">
        {/* Banky decorative swoosh line */}
        <svg className="absolute top-20 right-0 w-[45vw] h-auto opacity-40 md:opacity-60 pointer-events-none" viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M500 0 L500 300 Q500 350 450 350 L100 350 Q50 350 50 400 L50 600"
            stroke="white"
            strokeWidth="60"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: bankyEase, delay: 0.5 }}
          />
        </svg>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="w-full max-w-6xl mx-auto px-5 lg:px-8 pt-28 pb-20 relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: bankyEase, delay: 0.25 }}
              className="flex items-center justify-center order-2 lg:order-1"
            >
              <div className="relative w-[220px] sm:w-[300px] lg:w-[400px] xl:w-[440px] aspect-square">
                <img
                  src="/0c0468f7-d6eb-4bc0-acff-4ade9507ab1d-removebg-preview.png"
                  alt="Coastal Innovation Summit"
                  className="w-full h-full object-contain"
                  width={440}
                  height={440}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </motion.div>

            {/* Right: Messaging */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: bankyEase }}
                className="inline-flex items-center gap-2.5 px-4 py-2 bg-banky-blue/[0.08] text-banky-blue text-[12px] font-semibold tracking-[0.15em] uppercase mb-7 border border-banky-blue/15"
              >
                <span className="blue-dot" />
                Kasaragod, Kerala · 2026
              </motion.div>

              {/* Headline — Banky massive uppercase reveal */}
              <h1 className="hero-headline font-display mb-5">
                <div className="text-banky-blue">
                  <BankyTextReveal text="Coastal" delay={0.15} by="char" />
                </div>
                <div className="text-banky-dark">
                  <BankyTextReveal text="Innovation" delay={0.35} by="char" />
                </div>
                <div className="text-banky-blue">
                  <BankyTextReveal text="Summit" delay={0.55} by="char" />
                </div>
              </h1>

              {/* Chapter subtitle — banky.io style */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease: bankyEase }}
                className="mb-7"
              >
                <p className="text-banky-dark/50 text-[14px] font-medium tracking-[0.05em]">
                  Chapter 1 | Manjeshwar
                </p>
                <div className="w-10 h-[2px] bg-banky-blue/40 mt-2 mx-auto lg:mx-0" />
              </motion.div>

              {/* Subtitle — slides in */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: bankyEase }}
                className="text-[17px] md:text-[18px] text-banky-dark/60 leading-relaxed mb-9 max-w-md mx-auto lg:mx-0"
              >
                A beginner-friendly, zero-fluff startup learning experience for first-time learners and early-stage founders from North Malabar.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8, ease: bankyEase }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <Link to="/register"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-[15px]"
                >
                  Register Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/sessions"
                  className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 font-medium text-[15px]"
                >
                  View Schedule <CalendarDays className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ━━━ MARQUEE ━━━ */}
      <Marquee items={['Innovation', 'Entrepreneurship', 'North Malabar', 'Startups', 'Kasaragod', 'Technology', 'Community', 'Growth']} />

      {/* ━━━ INFO BAR ━━━ */}
      <CountdownTimer />

      {/* ━━━ ABOUT SECTION ━━━ */}
      <section className="py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left */}
            <RevealSection className="lg:col-span-3" direction="left">
              <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-5 flex items-center gap-2">
                <span className="w-8 h-px bg-banky-blue inline-block" />
                About the Summit
              </p>
              <h2 className="text-3xl lg:text-[44px] font-display font-bold text-banky-dark mb-7 leading-tight">
                The startup event that<br />Kasaragod deserves.
              </h2>
              <div className="text-[16px] text-banky-dark/60 space-y-4 mb-8">
                <p>
                  The Coastal Innovation Summit fills a critical gap — bringing structured, practical startup education to Tier-2 and Tier-3 regions where it's needed most.
                </p>
                <p>
                  No fluff. No vague motivation. Just real sessions from real founders on real problems — from legal mistakes to scaling challenges.
                </p>
              </div>
              <div className="banky-card p-5 border-l-2 border-l-banky-blue">
                <p className="text-[15px] text-banky-dark/60 italic">
                  "Designed to support active learning, encourage collaboration, and showcase regional inclusiveness."
                </p>
              </div>
            </RevealSection>

            {/* Right — Who it's for */}
            <RevealSection className="lg:col-span-2" direction="right">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="space-y-3"
              >
                {[
                  { num: '❶', title: 'First-time Learners', desc: 'Students and beginners getting their first real exposure to startups.' },
                  { num: '❷', title: 'Early-stage Founders', desc: 'Founders navigating execution, legal, and funding challenges.' },
                  { num: '❸', title: 'Experienced Professionals', desc: 'People looking to connect, mentor, or invest in the region.' },
                  { num: '❹', title: 'Regional Ecosystem', desc: 'Proving that innovation doesn\'t need a metro city.' },
                ].map((item) => (
                  <motion.div key={item.num} variants={staggerChild}
                    className="card-hover flex gap-4 p-4 banky-card group"
                  >
                    <span className="step-number text-[16px] shrink-0">{item.num}</span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-banky-dark mb-0.5 group-hover:text-banky-blue transition-colors duration-300">{item.title}</h3>
                      <p className="text-banky-dark/50 text-[13px] leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ━━━ STATS ━━━ */}
      <StatsCounter />

      {/* ━━━ ACTIVITY ZONES ━━━ */}
      <section className="py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <RevealSection className="max-w-xl mb-16">
            <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-5 flex items-center gap-2">
              <span className="w-8 h-px bg-banky-blue inline-block" />
              Beyond the main stage
            </p>
            <h2 className="text-3xl lg:text-[44px] font-display font-bold text-banky-dark mb-5 leading-tight">
              Activity Zones
            </h2>
            <p className="text-[16px] text-banky-dark/60">Four parallel tracks running alongside sessions. Pick what excites you.</p>
          </RevealSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {[
              { icon: Gamepad2, title: 'Startup Snake & Ladder', desc: 'Interactive game covering ideation, funding, legal basics, and scaling.', color: '#1B3FE4' },
              { icon: MessageSquare, title: 'Startup Debate', desc: 'Critical thinking on the hardest topics in building startups.', color: '#f97316' },
              { icon: Rocket, title: 'Startup Jam', desc: 'Rapid team-based ideation — form teams, build concepts, present.', color: '#a855f7' },
              { icon: Store, title: 'Exhibition Stalls', desc: 'Heritage, Agri-Tech, tribal enterprise, and local food businesses.', color: '#059669' },
            ].map((zone) => {
              const Icon = zone.icon;
              return (
                <motion.div key={zone.title} variants={staggerChild}
                  className="card-hover banky-card p-7 group relative overflow-hidden"
                >
                  {/* Subtle top glow bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${zone.color}, transparent)` }} />
                  <div className="w-12 h-12 flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
                    style={{ backgroundColor: `${zone.color}12`, color: zone.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-banky-dark mb-2 group-hover:text-banky-blue transition-colors duration-300">{zone.title}</h3>
                  <p className="text-[13px] text-banky-dark/50 leading-relaxed">{zone.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <RevealSection className="mt-12">
            <Link to="/sessions" className="inline-flex items-center gap-2 text-banky-blue text-[14px] font-semibold hover:gap-3.5 transition-all duration-500 group">
              View full schedule
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="py-28 md:py-36 relative overflow-hidden bg-banky-dark text-white">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center relative z-10">
          <RevealSection direction="scale">
            <div className="w-14 h-14 bg-banky-blue/[0.12] border border-banky-blue/20 flex items-center justify-center mx-auto mb-7">
              <Sparkles className="w-6 h-6 text-banky-blue-light" />
            </div>
            <h2 className="text-3xl md:text-[48px] font-display font-bold text-white mb-6 leading-tight">
              <div><BankyTextReveal text="Ready to be part of" delay={0.1} by="word" scrollTriggered /></div>
              <div><BankyTextReveal text="something meaningful?" delay={0.32} by="word" scrollTriggered /></div>
            </h2>
            <p className="text-white/60 text-[17px] max-w-lg mx-auto mb-10">
              Join 300+ attendees, 8 speakers, and 7 zero-fluff sessions at the first event of its kind in North Malabar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register"
                className="btn-primary inline-flex items-center justify-center gap-2 px-9 py-4 font-semibold text-[15px]"
              >
                Register Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about"
                className="inline-flex items-center justify-center text-white/70 px-9 py-4 font-medium text-[15px] border border-white/20 hover:border-white/40 hover:text-white transition-all duration-500"
              >
                Learn More
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ━━━ ORGANISER ━━━ */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <RevealSection>
            <div className="banky-card p-8 md:p-12 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <img src="/organiser.avif" alt="BuildUp Kasaragod" className="w-20 h-20 object-cover shrink-0 ring-2 ring-banky-border" width={80} height={80} loading="lazy" decoding="async" />
                <div>
                  <p className="text-[12px] text-banky-dark/50 font-medium uppercase tracking-[0.2em] mb-1">Organized by</p>
                  <h3 className="text-xl font-display font-bold text-banky-dark mb-1">BuildUp Kasaragod</h3>
                  <p className="text-[13px] text-banky-dark/50 mb-4">Non-Profit Organization · Kasaragod, Kerala</p>
                  <p className="text-[15px] text-banky-dark/60 mb-6 max-w-xl leading-relaxed">
                    BuildUp Kasaragod is an NGO fostering entrepreneurship in the Kasaragod district. The Coastal Innovation Summit is their flagship initiative.
                  </p>
                  <div className="flex gap-3">
                    <a href="https://www.buildupkasaragod.org" target="_blank" rel="noreferrer"
                      className="btn-primary px-5 py-2.5 font-semibold text-[13px]">
                      Visit Website
                    </a>
                    <a href="mailto:contact@buildupkasaragod.org"
                      className="btn-outline px-5 py-2.5 font-medium text-[13px]">
                      Get in Touch
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

    </div>
    </>
  );
}
