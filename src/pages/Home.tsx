import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Gamepad2, MessageSquare, Rocket, Store } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import StatsCounter from '../components/StatsCounter';

const HeroModel3D = lazy(() => import('../components/HeroModel3D'));

export default function Home() {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlideIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        .hero-wrapper {
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 0.9s ease-out, transform 0.9s ease-out;
        }
        .hero-wrapper.slide-in {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* Event Schema Structured Data (JSON-LD for SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Coastal Innovation Summit 2026',
            startDate: '2026-05-10T08:00:00+05:30',
            endDate: '2026-05-10T17:30:00+05:30',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'Place',
              name: 'Govinda Pai Smarakam Bhavanika Auditorium',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Manjeshwar',
                addressRegion: 'Kasaragod, Kerala',
                addressCountry: 'IN',
              },
            },
            organizer: {
              '@type': 'Organization',
              name: 'BuildUp Kasaragod',
              url: 'https://www.buildupkasaragod.org',
            },
            description: 'A structured, beginner-friendly, zero-fluff startup learning experience for first-time learners and early-stage founders from the North Malabar region.',
            offers: [
              { '@type': 'Offer', name: 'Gold Delegate', price: '499', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
              { '@type': 'Offer', name: 'Diamond VIP', price: '1499', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
            ],
          }),
        }}
      />
    <div className="relative min-h-screen bg-brand-surface selection:bg-brand-accent/20">
      
      {/* 1. Hero Section */}
      <section className="relative w-full flex flex-col justify-center overflow-hidden bg-brand-surface border-b border-slate-200 min-h-0 lg:min-h-[90vh]">
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24 md:pt-32 pb-8 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left: 3D Model via Three.js — float animation in WebGL, zero CSS conflict */}
            <div className={`flex items-center justify-center order-2 lg:order-1 hero-wrapper${slideIn ? ' slide-in' : ''}`}>
              <div className="w-[180px] sm:w-[260px] lg:w-[360px] xl:w-[420px] aspect-square">
                <Suspense fallback={
                  <img
                    src="/0c0468f7-d6eb-4bc0-acff-4ade9507ab1d-removebg-preview.png"
                    alt="Coastal Innovation Summit 3D Model"
                    className="w-full h-full object-contain"
                    width={420}
                    height={420}
                  />
                }>
                  <HeroModel3D />
                </Suspense>
              </div>
            </div>

            {/* Right: Text Content */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
              }}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left order-1 lg:order-2"
            >
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="inline-flex items-center justify-center lg:justify-start gap-2 py-1.5 px-3 md:px-4 bg-transparent border border-slate-300 text-[10px] md:text-xs font-bold text-slate-700 tracking-[0.2em] uppercase mb-6 md:mb-8 max-w-full"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                <span>FIRST OF ITS KIND IN THE REGION</span>
              </motion.div>
              
              <motion.h1 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                className="text-[32px] sm:text-4xl md:text-5xl lg:text-7xl font-display font-black tracking-tight text-brand-ocean uppercase leading-[0.95] mb-4 md:mb-7"
              >
                COASTAL<br />
                INNOVATION<br />
                <span className="text-brand-accent">SUMMIT</span>
                <span className="text-brand-red">'26</span>
              </motion.h1>
              
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="mb-6"
              >
                <p className="text-lg md:text-xl font-display font-bold text-brand-ocean tracking-wide">2026 MAY 10</p>
                <p className="text-sm md:text-base font-bold text-slate-500 uppercase tracking-[0.15em]">GOVINDA PAI SMARAKAM, MANJESHWAR</p>
              </motion.div>
            
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <Link 
                  to="/register"
                  className="bg-brand-ocean text-white px-7 py-3.5 font-bold uppercase tracking-wider text-sm hover:bg-brand-red transition-colors border-2 border-brand-ocean flex items-center justify-center gap-3"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4"/>
                </Link>
                <Link 
                  to="/sessions"
                  className="bg-transparent text-brand-ocean px-7 py-3.5 font-bold uppercase tracking-wider text-sm hover:bg-slate-100 transition-colors border-2 border-slate-300 text-center"
                >
                  Session Schedule
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Countdown below the grid */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-10">
          <CountdownTimer />
        </div>
      </section>

      {/* 2. Executive Summary / About Section */}
      <section className="py-20 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-black text-brand-ocean uppercase mb-4 leading-tight">Bridging Heritage <br/><span className="text-brand-accent">With Hyper-Tech</span></h2>
              <div className="w-16 h-1.5 bg-brand-red mb-6"></div>
              <div className="prose prose-base text-slate-600 font-medium space-y-5">
                <p>
                  The Coastal Innovation Summit is well-structured, credible, and purpose-built. It is not positioned to compete in scale with flagship startup festivals. Instead, it fills a critical gap by serving Tier-2 and Tier-3 regions with a structured, beginner-friendly, zero-fluff startup learning experience.
                </p>
                <p>
                  Taking place at the historic <strong>Govinda Pai Smarakam Bhavanika Auditorium</strong> in Manjeshwar, Kasaragod, this conclave is designed to align the region's rich intellectual heritage with long-term tech ecosystem building.
                </p>
                <p className="font-bold text-slate-800 border-l-4 border-brand-accent pl-4 text-sm">
                  "Designed to support active learning, encourage collaboration, and showcase regional inclusiveness."
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:mt-0">
              <div className="bg-slate-50 p-6 border border-slate-200">
                <span className="text-brand-accent font-display font-black text-3xl mb-3 block">01</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">First-time Learners</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">Accessible entry points into the startup ecosystem for students and absolute beginners.</p>
              </div>
              <div className="bg-slate-50 p-6 border border-slate-200">
                <span className="text-brand-accent font-display font-black text-3xl mb-3 block">02</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">Early-stage Founders</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">Practical guidance for navigating early execution challenges and avoiding fatal mistakes.</p>
              </div>
              <div className="bg-slate-50 p-6 border border-slate-200 sm:col-span-2">
                <span className="text-brand-red font-display font-black text-3xl mb-3 block">03</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">Experienced Pros</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">High-value networking, critical ecosystem building, and deep-dive strategy sessions designed to scale regional impacts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Area */}
      <StatsCounter />

      {/* 4. Activity Zones Section */}
      <section className="py-16 md:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <h2 className="text-2xl md:text-4xl font-display font-black uppercase text-brand-ocean leading-tight">Dynamic <br className="hidden md:block"/><span className="text-brand-accent">Activity Zones</span></h2>
            <p className="text-[15px] text-slate-600 font-medium max-w-lg">While the main stage hosts zero-fluff talks, our parallel activity zones focus on interaction, learning by doing, and open networking. Operating side-by-side to ensure continuous engagement.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-px lg:bg-slate-200 border border-slate-200">
            <div className="bg-white p-6 sm:p-8 hover:bg-slate-50 transition-all border-b-4 border-transparent hover:border-brand-accent group">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-5 transition-colors group-hover:bg-brand-accent">
                <Gamepad2 className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-bold text-brand-ocean mb-2 uppercase tracking-wide">Startup Snake & Ladder</h3>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">A large-format interactive game covering ideation, funding, legal basics, and scaling. Answer business questions to climb!</p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 hover:bg-slate-50 transition-all border-b-4 border-transparent hover:border-brand-red group">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-5 transition-colors group-hover:bg-brand-red">
                <MessageSquare className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-bold text-brand-ocean mb-2 uppercase tracking-wide">Startup Debate</h3>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">Moderated sessions designed to encourage critical thinking and argumentation on the hardest topics in the startup ecosystem.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 hover:bg-slate-50 transition-all border-b-4 border-transparent hover:border-brand-accent group">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-5 transition-colors group-hover:bg-brand-accent">
                <Rocket className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-bold text-brand-ocean mb-2 uppercase tracking-wide">Startup Jam</h3>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">A rapid team-based ideation activity. Form teams instantly, structure a startup concept, and present it before time runs out.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 hover:bg-slate-50 transition-all border-b-4 border-transparent hover:border-brand-red group">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-5 transition-colors group-hover:bg-brand-red">
                <Store className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-bold text-brand-ocean mb-2 uppercase tracking-wide">Exhibition Stalls</h3>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">Discover Tribal Enterprise, Kasaragod Heritage, Agri-Tech innovations, and Local Food businesses operating all day.</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/sessions"
              className="inline-block px-8 py-4 bg-brand-ocean text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-red transition-colors"
            >
              See the Full Schedule
            </Link>
          </div>
        </div>
      </section>
      {/* 5. Organiser Section */}
      <section className="py-16 md:py-20 bg-brand-surface border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10 pb-6 border-b border-slate-200">
            <h2 className="text-2xl md:text-4xl font-display font-black uppercase text-brand-ocean leading-tight">
              Organized <span className="text-brand-accent">By</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12 items-center">
            {/* Organiser Logo */}
            <div className="flex justify-center">
              <img
                src="/organiser.avif"
                alt="BuildUp Kasaragod"
                className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] object-cover rounded-full border-2 border-slate-200 shadow-sm"
                width={180}
                height={180}
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Organiser Info */}
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-black text-brand-ocean uppercase tracking-tight mb-2">
                BuildUp Kasaragod
              </h3>
              <p className="text-[10px] font-bold text-brand-red uppercase tracking-[0.25em] mb-5">
                Non-Profit Organization · Kasaragod, Kerala
              </p>

              <div className="prose prose-base text-slate-600 font-medium space-y-4 mb-6">
                <p>
                  BuildUp Kasaragod is an NGO focused on fostering entrepreneurship and innovation in the Kasaragod district. Through structured programs, community events, and educational initiatives, the organization works to bridge the gap between grassroots talent and mainstream startup ecosystems.
                </p>
                <p>
                  The Coastal Innovation Summit is their flagship initiative — designed to bring world-class startup learning experiences to Tier-2 and Tier-3 regions, proving that impactful ecosystem building doesn't require a metro city.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.buildupkasaragod.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-6 py-3 bg-brand-ocean text-white font-bold uppercase tracking-wider text-xs hover:bg-brand-red transition-colors"
                >
                  Visit Website
                </a>
                <a
                  href="mailto:contact@buildupkasaragod.org"
                  className="inline-block px-6 py-3 bg-transparent text-brand-ocean font-bold uppercase tracking-wider text-xs border-2 border-slate-300 hover:border-brand-accent hover:text-brand-accent transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}
