import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Utensils, UserCheck } from 'lucide-react';

const bankyEase = [0.16, 1, 0.3, 1] as const;
const staggerC = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const staggerI = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: bankyEase } } };

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: bankyEase }} className={className}>{children}</motion.div>;
}

const budgetRows = [
  { head: 'First Prize', amount: '75,000', note: 'Winner', isSubtotal: false },
  { head: 'Second Prize', amount: '50,000', note: 'Runner-up', isSubtotal: false },
  { head: 'Third Prize', amount: '25,000', note: 'Second Runner-up', isSubtotal: false },
  { head: 'Prize Money Sub-total', amount: '1,50,000', note: '', isSubtotal: true },
  { head: 'Catering (All meals)', amount: '50,000 – 60,000', note: 'Approx.', isSubtotal: false },
  { head: 'Events Sub-total', amount: '50,000 – 60,000', note: '', isSubtotal: true },
  { head: 'Judges — Travel & Stay (5)', amount: '35,000', note: '₹7k/judge', isSubtotal: false },
  { head: 'Judges Sub-total', amount: '35,000', note: '', isSubtotal: true },
];

const keyNotes = [
  'Catering costs are approximate and may vary based on participant count.',
  'Judge travel & accommodation is estimated at ₹7,000 per judge for 5 judges.',
  'Prize money will be disbursed directly to winning teams on event day.',
  'All payments processed through BuildUp Kasaragod.',
];

export default function Events() {
  return (
    <div className="min-h-screen bg-white pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: bankyEase }} className="mb-14">
          <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2"><span className="w-8 h-px bg-banky-blue inline-block" />Pre-Event</p>
          <h1 className="text-3xl md:text-[44px] font-display font-bold text-banky-dark mb-4 leading-tight">Events & Hackathons</h1>
          <p className="text-[16px] text-banky-dark/50 max-w-xl">Before the main summit, we're launching pre-events to build momentum.</p>
        </motion.div>

        <Reveal className="mb-14">
          <section className="banky-card p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px] gap-8 items-start">
              <div>
                <p className="text-banky-dark/40 text-[12px] font-medium uppercase tracking-[0.2em] mb-4">Chapter 1 | Manjeshwar</p>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-banky-dark leading-tight mb-4">Pre-Event Hackathon</h2>
                <p className="text-banky-dark/60 text-[15px] leading-relaxed max-w-lg mb-5">A time-bound hackathon where student teams identify real-world problems and develop practical solutions.</p>
                <div className="text-[13px] text-banky-dark/50 mb-5">Sahyadri College · In collaboration with BuildUp Kasaragod</div>
                <div className="flex items-center gap-2 mb-7 text-[13px] text-banky-dark/50"><span className="blue-dot" />Date — to be announced</div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-semibold text-[14px] rounded-full">Register Interest <ArrowRight className="w-3.5 h-3.5" /></Link>
                  <Link to="/contact" className="btn-outline inline-flex items-center gap-2 px-6 py-3 font-medium text-[14px] rounded-full">Contact Us</Link>
                </div>
              </div>
              <div className="text-center lg:pt-4">
                <p className="text-[12px] text-banky-dark/40 mb-1 uppercase tracking-[0.15em]">Total Budget</p>
                <p className="font-display text-3xl font-bold text-gradient">₹2.35L</p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal className="mb-14">
          <p className="text-amber-600 text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2"><span className="w-8 h-px bg-amber-600 inline-block" />Rewards</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-banky-dark mb-7">Prize Pool</h2>
          <motion.div variants={staggerC} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-3 gap-4 mb-5">
            {[{ place: '❶', label: 'Winner', amount: '₹75,000' }, { place: '❷', label: 'Runner-up', amount: '₹50,000' }, { place: '❸', label: '2nd Runner-up', amount: '₹25,000' }].map((p) => (
              <motion.div key={p.place} variants={staggerI} className="card-hover banky-card p-6 text-center group">
                <span className="text-amber-600 text-xl font-bold block mb-2">{p.place}</span>
                <p className="text-xl font-display font-bold text-banky-dark mb-0.5">{p.amount}</p>
                <p className="text-[12px] text-banky-dark/40">{p.label}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="flex items-center justify-between p-4 banky-card border border-banky-blue/15">
            <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-banky-blue" /><span className="font-medium text-banky-dark text-[14px]">Total Prize Pool</span></div>
            <span className="font-display font-bold text-xl text-gradient">₹1,50,000</span>
          </div>
        </Reveal>

        <Reveal className="mb-14">
          <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2"><span className="w-8 h-px bg-banky-blue inline-block" />Financials</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-banky-dark mb-7">Budget Breakdown</h2>
          <div className="overflow-x-auto banky-card overflow-hidden">
            <table className="w-full text-left">
              <thead><tr className="bg-banky-blue/[0.06] border-b border-banky-border/30"><th className="py-3 px-4 text-[12px] font-medium text-banky-blue w-8">#</th><th className="py-3 px-4 text-[12px] font-medium text-banky-blue">Budget Head</th><th className="py-3 px-4 text-[12px] font-medium text-banky-blue text-right">Total (INR)</th><th className="py-3 px-4 text-[12px] font-medium text-banky-blue hidden sm:table-cell">Notes</th></tr></thead>
              <tbody>
                {(() => {
                  let rowNum = 0;
                  return budgetRows.map((row, i) => {
                    if (!row.isSubtotal) rowNum++;
                    return (
                      <tr key={i} className={`border-t border-banky-border/20 hover:bg-gray-50 ${row.isSubtotal ? 'bg-gray-50' : ''}`}>
                        <td className="py-3 px-4 text-[13px] text-banky-dark/40 font-mono">{row.isSubtotal ? '' : rowNum}</td>
                        <td className={`py-3 px-4 text-[13px] ${row.isSubtotal ? 'font-semibold text-banky-dark' : 'text-banky-dark/60'}`}>{row.head}</td>
                        <td className={`py-3 px-4 text-[13px] text-right font-mono ${row.isSubtotal ? 'font-semibold text-banky-blue' : 'text-banky-dark/60'}`}>₹{row.amount}</td>
                        <td className="py-3 px-4 text-[12px] text-banky-dark/40 hidden sm:table-cell">{row.note}</td>
                      </tr>
                    );
                  });
                })()}
                <tr className="bg-banky-blue/[0.06] border-t border-banky-border/30"><td className="py-3 px-4" /><td className="py-3 px-4 font-medium text-[13px] text-banky-dark">Total Estimated Budget</td><td className="py-3 px-4 text-right font-display font-bold text-lg text-banky-blue">₹2,35,000</td><td className="py-3 px-4 hidden sm:table-cell" /></tr>
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal className="mb-14">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-banky-dark mb-7">What's Included</h2>
          <motion.div variants={staggerC} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{ icon: Trophy, title: 'Prize Money', desc: '₹1,50,000 for top 3 teams.' }, { icon: Utensils, title: 'Full Catering', desc: 'All meals for attendees.' }, { icon: UserCheck, title: 'Expert Judges', desc: '5 judges fully covered.' }].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} variants={staggerI} className="card-hover p-6 banky-card group">
                  <Icon className="w-5 h-5 text-banky-blue mb-4 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-[15px] font-semibold text-banky-dark mb-1">{item.title}</h3>
                  <p className="text-[13px] text-banky-dark/50 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </Reveal>

        <Reveal className="mb-14">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-banky-dark mb-7">Key Notes</h2>
          <div className="banky-card p-6 md:p-8">
            <ol className="space-y-4">
              {keyNotes.map((note, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5, ease: bankyEase }} className="flex items-start gap-3">
                  <span className="text-banky-blue text-[13px] font-mono shrink-0 pt-0.5">{i + 1}.</span>
                  <p className="text-banky-dark/60 text-[14px] leading-relaxed">{note}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal>
          <section className="rounded-2xl p-8 md:p-12 text-center bg-banky-dark">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4">Ready to build something?</h2>
            <p className="text-white/50 text-[14px] max-w-md mx-auto mb-8">Gather your team and build at the pre-event hackathon.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-[14px] rounded-full">Register Now <ArrowRight className="w-3.5 h-3.5" /></Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white font-medium text-[14px] border border-white/20 rounded-full hover:border-white/40 transition-all duration-500">Sponsor This Event</Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
