import { motion } from 'framer-motion';

const schedule = [
  { time: '08:00 - 08:30', title: 'Registration & Check-In', type: 'Welcome' },
  { time: '08:30 - 09:00', title: 'Session 1: From Zero to First Step', desc: 'What a startup really is and common beginner mistakes', type: 'Main Stage' },
  { time: '09:00 - 09:30', title: 'Inaugural Session', desc: 'Welcome note, Chief Guest address, regional documentary', type: 'Main Stage' },
  { time: '09:30 - 10:10', title: 'Session 2: Why Startups Actually Fail', desc: 'Team and execution gaps', type: 'Main Stage' },
  { time: '10:10 - 10:50', title: 'Session 3: Legal Mistakes That Kill Startups', desc: 'Registration, IP, Compliance', type: 'Main Stage' },
  { time: '10:50 - 11:05', title: 'Tea Break', type: 'Networking' },
  { time: '11:05 - 11:45', title: 'Session 4: Different Backgrounds, Same Start', desc: 'Moderated multi-sector discussion', type: 'Main Stage' },
  { time: '11:45 - 12:25', title: 'Session 5: Turning an Idea Into Something Real', desc: 'Validation and first customers', type: 'Main Stage' },
  { time: '12:25 - 13:30', title: 'Lunch & Open Networking', type: 'Networking' },
  { time: '13:30 - 14:10', title: 'Session 6: Scaling Is Harder Than Starting', desc: 'Growth, hiring, cash flow', type: 'Main Stage' },
  { time: '14:10 - 14:50', title: 'Session 7: Build From Anywhere, Scale Everywhere', type: 'Main Stage' },
  { time: '14:50 - 15:30', title: 'Live Podcast Focus', type: 'Podcast Zone' },
  { time: '15:30 - 16:00', title: 'Live Startup Pitching', desc: 'Structured feedback for early stage ideas', type: 'Main Stage' },
  { time: '16:00 - 17:30', title: 'Closing Session: Your Next 30 Days', desc: 'The next steps decide everything', type: 'Main Stage' }
];

const parallelZones = [
  { time: '08:30 - 10:00', event: 'Startup Snake and Ladder', zone: 'Interactive Games Zone' },
  { time: '11:00 - 16:30', event: 'Live Podcast & Networking Zone', zone: 'Podcast Zone' },
  { time: '11:30 - 12:15', event: 'Startup Debate Round 1', zone: 'Debate Zone' },
  { time: '13:45 - 15:15', event: 'Startup Jam (Ideation Activity)', zone: 'Jam Zone' },
  { time: '08:30 - 17:30', event: 'Exhibition & Startup Stalls Continuous', zone: 'Stall Zone' }
];

export default function Sessions() {
  return (
    <div className="min-h-screen bg-brand-surface pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-brand-ocean tracking-tight uppercase">Program <span className="text-brand-accent">Schedule</span></h1>
          <p className="text-slate-600 mt-4 text-base md:text-lg max-w-2xl mx-auto font-medium">Focused on zero-fluff education. A strict, time-disciplined schedule aimed at first-time learners, early-stage founders, and ecosystem builders.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Stage Timeline */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-brand-ocean mb-8 border-b border-slate-200 pb-4 font-display">Main Stage Execution</h2>
            <div className="relative border-l-2 border-slate-200 pl-6 md:pl-8 space-y-8 md:space-y-10 mt-6 md:mt-0">
              {schedule.map((item, i) => (
                <div key={i} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[33px] md:-left-[41px] w-4 h-4 border-2 border-white ${
                    item.type === 'Main Stage' ? 'bg-brand-red' : 
                    item.type === 'Networking' ? 'bg-brand-accent' : 'bg-slate-800'
                  } group-hover:scale-125 transition-transform`} />
                  
                  <div className="bg-white p-5 md:p-6 border-2 border-slate-200 hover:border-slate-800 transition-colors">
                    <span className="text-[10px] md:text-xs font-bold text-brand-accent uppercase tracking-[0.2em]">{item.time}</span>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-2">{item.title}</h3>
                    {item.desc && <p className="text-sm md:text-[15px] text-slate-600 mt-2 font-medium">{item.desc}</p>}
                    <span className="inline-block mt-4 text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white bg-slate-900 px-3 py-1">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parallel Activity Zones */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-brand-ocean mb-8 border-b border-slate-200 pb-4 font-display">Parallel Zones</h2>
            <div className="space-y-4">
              {parallelZones.map((item, i) => (
                <div key={i} className="bg-slate-50 p-6 border border-slate-200 hover:border-slate-800 transition-colors">
                  <div className="text-brand-red mb-2 text-xs uppercase tracking-widest font-bold">{item.time}</div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{item.event}</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">{item.zone}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-brand-ocean mt-10 md:mt-12 mb-6 md:mb-8 border-b-2 border-slate-200 pb-4 font-display uppercase tracking-wide">Stalls Output</h2>
            <div className="bg-brand-ocean p-6 md:p-8 border border-white/10 text-white">
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3"><span className="text-brand-accent">■</span> Tribal Enterprise Stall</li>
                <li className="flex items-start gap-3"><span className="text-brand-accent">■</span> Kasaragod Culture & Heritage</li>
                <li className="flex items-start gap-3"><span className="text-brand-accent">■</span> Agri-Tech & Rural Innovation</li>
                <li className="flex items-start gap-3"><span className="text-brand-accent">■</span> Tech & Student Startups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}