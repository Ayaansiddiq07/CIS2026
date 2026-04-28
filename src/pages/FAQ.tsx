import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const bankyEase = [0.16, 1, 0.3, 1] as const;

const faqCategories = [
  { category: 'General', items: [
    { q: 'What is the Coastal Innovation Summit?', a: 'A structured, beginner-friendly startup learning experience for first-time learners and early-stage founders from the North Malabar region.' },
    { q: 'When and where is the event?', a: 'The date, venue, and timings are being finalized. The event will be held in Kasaragod district, Kerala.' },
    { q: 'Who is this event for?', a: 'Anyone interested in startups — students, early-stage founders, and experienced professionals.' },
    { q: 'Who organizes this?', a: 'BuildUp Kasaragod, an NGO focused on entrepreneurship in the Kasaragod district.' },
  ]},
  { category: 'Registration & Passes', items: [
    { q: 'How do I register?', a: 'Visit the Register page. We offer Gold Delegate (₹499), Diamond VIP (₹1,499), Bulk Pass (₹3,999 for 10), and Stall Space (₹4,999/booth).' },
    { q: 'What does Gold Delegate include?', a: 'Full access to Main Stage sessions, all parallel Activity Zones, and standard networking.' },
    { q: 'What does Diamond VIP offer?', a: 'Priority seating, VIP Networking Lounge, private Speaker Q&A, and exclusive merchandise.' },
    { q: 'Can I register as a group?', a: 'Yes. The Bulk Pass (₹3,999) includes 10 Gold Delegate passes.' },
  ]},
  { category: 'Event Day', items: [
    { q: 'What are the Activity Zones?', a: 'Four parallel zones: Startup Snake & Ladder, Startup Debate, Startup Jam, and Exhibition Stalls.' },
    { q: 'Will food be provided?', a: 'Lunch and refreshments are included for all attendees.' },
    { q: 'Can I book a stall?', a: 'Yes. Stall Space starts at ₹4,999/booth with a 3×3m premium space and 2 exhibitor passes.' },
  ]},
  { category: 'Contact', items: [
    { q: 'How can I contact the organizers?', a: 'Email contact@buildupkasaragod.org or visit buildupkasaragod.org.' },
    { q: 'Can my organization partner?', a: 'Absolutely. We are actively onboarding ecosystem partners. Reach out via email.' },
  ]},
];
const allFaqs = faqCategories.flatMap(c => c.items);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const toggle = (key: string) => setOpenIndex(openIndex === key ? null : key);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: allFaqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <div className="min-h-screen bg-banky-yellow pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-2xl mx-auto px-5 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: bankyEase }} className="mb-12">
            <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-banky-blue inline-block" />Help
            </p>
            <h1 className="text-3xl md:text-[44px] font-display font-bold text-banky-dark mb-4 leading-tight">Frequently Asked Questions</h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[16px] text-banky-dark/50">Everything you need to know about the Coastal Innovation Summit.</motion.p>
          </motion.div>

          {faqCategories.map((cat, catIdx) => (
            <motion.div key={catIdx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: catIdx * 0.05, ease: bankyEase }}
              className="mb-8"
            >
              <h2 className="text-[13px] font-semibold text-banky-blue uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-banky-blue inline-block" />{cat.category}
              </h2>
              <div className="banky-card divide-y divide-banky-border/20 overflow-hidden">
                {cat.items.map((faq, faqIdx) => {
                  const key = `${catIdx}-${faqIdx}`;
                  const isOpen = openIndex === key;
                  return (
                    <button key={key} onClick={() => toggle(key)} className="w-full text-left p-5 hover:bg-banky-yellow/30 transition-colors duration-500" aria-expanded={isOpen}>
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-[15px] font-medium text-banky-dark">{faq.q}</h3>
                        <ChevronDown className={`w-4 h-4 text-banky-dark/40 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-banky-blue' : ''}`} />
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: bankyEase }}
                            className="overflow-hidden"
                          >
                            <p className="text-[14px] text-banky-dark/60 leading-relaxed mt-3">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: bankyEase }}
            className="rounded-2xl p-7 md:p-10 text-center mt-8 bg-banky-dark"
          >
            <p className="text-white/50 text-[14px] mb-4">Still have questions?</p>
            <Link to="/contact" className="btn-primary inline-block px-6 py-3 font-semibold text-[14px] rounded-full">Contact Organizers</Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}