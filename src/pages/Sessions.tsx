import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Coffee, Mic, Gamepad2, MessageSquare, Rocket, Store } from 'lucide-react';
import BankyTextReveal from '../components/BankyTextReveal';

const bankyEase = [0.16, 1, 0.3, 1] as const;
const staggerC = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const staggerI = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: bankyEase } } };

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: bankyEase }} className={className}>{children}</motion.div>;
}

const schedule = [
  { time: '08:00 – 08:30', title: 'Registration & Check-In', type: 'welcome', icon: Clock },
  { time: '08:30 – 09:00', title: 'Session 1: From Zero to First Step', desc: 'What a startup really is and common beginner mistakes', type: 'session', icon: Mic },
  { time: '09:00 – 09:30', title: 'Inaugural Session', desc: 'Welcome note, Chief Guest address, regional documentary', type: 'session', icon: Mic },
  { time: '09:30 – 10:10', title: 'Session 2: Why Startups Actually Fail', desc: 'Team and execution gaps', type: 'session', icon: Mic },
  { time: '10:10 – 10:50', title: 'Session 3: Legal Mistakes That Kill Startups', desc: 'Registration, IP, Compliance', type: 'session', icon: Mic },
  { time: '10:50 – 11:05', title: 'Tea Break', type: 'break', icon: Coffee },
  { time: '11:05 – 11:45', title: 'Session 4: Different Backgrounds, Same Start', desc: 'Moderated multi-sector discussion', type: 'session', icon: Mic },
  { time: '11:45 – 12:25', title: 'Session 5: Turning an Idea Into Something Real', desc: 'Validation and first customers', type: 'session', icon: Mic },
  { time: '12:25 – 13:30', title: 'Lunch & Open Networking', type: 'break', icon: Coffee },
  { time: '13:30 – 14:10', title: 'Session 6: Scaling Is Harder Than Starting', desc: 'Growth, hiring, cash flow', type: 'session', icon: Mic },
  { time: '14:10 – 14:50', title: 'Session 7: Build From Anywhere, Scale Everywhere', type: 'session', icon: Mic },
  { time: '14:50 – 15:30', title: 'Live Podcast Focus', type: 'special', icon: Mic },
  { time: '15:30 – 16:00', title: 'Live Startup Pitching', desc: 'Structured feedback for early stage ideas', type: 'session', icon: Mic },
  { time: '16:00 – 17:30', title: 'Closing Session: Your Next 30 Days', desc: 'The next steps decide everything', type: 'session', icon: Mic }
];

const parallelZones = [
  { time: '08:30 – 10:00', event: 'Startup Snake and Ladder', icon: Gamepad2 },
  { time: '11:00 – 16:30', event: 'Live Podcast & Networking', icon: Mic },
  { time: '11:30 – 12:15', event: 'Startup Debate Round 1', icon: MessageSquare },
  { time: '13:45 – 15:15', event: 'Startup Jam', icon: Rocket },
  { time: '08:30 – 17:30', event: 'Exhibition Stalls', icon: Store },
];

export default function Sessions() {
  return (
    <div className="min-h-screen bg-white pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: bankyEase }} className="mb-14">
          <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-banky-blue inline-block" />Schedule
          </p>
          <h1 className="text-3xl md:text-[44px] font-display font-bold text-banky-dark mb-4 leading-tight">
            <BankyTextReveal text="Program Schedule" by="char" delay={0.08} />
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-banky-dark/50 text-[16px] max-w-2xl">A strict, time-disciplined schedule. No filler sessions.</motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stage */}
          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: bankyEase }}
              className="text-[13px] font-semibold text-banky-blue uppercase tracking-[0.2em] mb-5 flex items-center gap-2"
            >
              <span className="w-4 h-px bg-banky-blue inline-block" />Main Stage
            </motion.h2>
            <div className="space-y-1.5">
              {schedule.map((item, i) => {
                const isBreak = item.type === 'break';
                const isSpecial = item.type === 'special';
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.5, delay: i * 0.03, ease: bankyEase }}
                    className={`flex flex-col sm:flex-row gap-1 sm:gap-4 p-3 sm:p-4 transition-all duration-500 group ${
                      isBreak ? 'bg-amber-500/[0.08] border border-amber-500/15' :
                      isSpecial ? 'bg-purple-500/[0.08] border border-purple-500/15' :
                      'hover:bg-white/40 border border-transparent hover:border-banky-border/30'
                    }`}
                  >
                    <span className="text-[11px] sm:text-[12px] text-banky-dark/40 font-mono sm:w-[110px] shrink-0 sm:pt-0.5">{item.time}</span>
                    <div>
                      <h3 className={`text-[14px] sm:text-[15px] font-semibold transition-colors duration-300 ${
                        isBreak ? 'text-amber-600' : isSpecial ? 'text-purple-600' : 'text-banky-dark group-hover:text-banky-blue'
                      }`}>{item.title}</h3>
                      {item.desc && <p className="text-[12px] sm:text-[13px] text-banky-dark/40 mt-0.5">{item.desc}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Reveal>
              <h2 className="text-[13px] font-semibold text-banky-blue uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-banky-blue inline-block" />Parallel Zones
              </h2>
              <motion.div variants={staggerC} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-2">
                {parallelZones.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} variants={staggerI} className="card-hover p-4 banky-card group">
                      <span className="text-[12px] text-banky-dark/40 font-mono block mb-1">{item.time}</span>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-banky-blue transition-transform duration-500 group-hover:scale-110" />
                        <h3 className="text-[14px] font-semibold text-banky-dark group-hover:text-banky-blue transition-colors duration-300">{item.event}</h3>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Reveal>

            <Reveal className="mt-8">
              <h2 className="text-[13px] font-semibold text-banky-blue uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-banky-blue inline-block" />Exhibition Stalls
              </h2>
              <motion.div variants={staggerC} initial="hidden" whileInView="visible" viewport={{ once: true }} className="banky-card p-5">
                <ul className="space-y-3 text-[14px] text-banky-dark/60">
                  {['Tribal Enterprise Stall', 'Kasaragod Culture & Heritage', 'Agri-Tech & Rural Innovation', 'Tech & Student Startups'].map((stall) => (
                    <motion.li key={stall} variants={staggerI} className="flex items-center gap-2">
                      <span className="blue-dot" style={{ width: 4, height: 4 }} />
                      {stall}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
