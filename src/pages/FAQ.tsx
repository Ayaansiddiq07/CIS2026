import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqCategories = [
  {
    category: 'General',
    items: [
      {
        q: 'What is the Coastal Innovation Summit?',
        a: 'The Coastal Innovation Summit is a structured, beginner-friendly, zero-fluff startup learning experience. It is designed for first-time learners and early-stage founders from the North Malabar region, bringing the core of the startup ecosystem to Tier-2 and Tier-3 regions.',
      },
      {
        q: 'When and where is the event?',
        a: 'The summit takes place on May 10, 2026 at Govinda Pai Smarakam Bhavanika Auditorium, Manjeshwar, Kasaragod, Kerala. The venue is part of the Gilivindu Project, a national-level centre of literature, culture, and research.',
      },
      {
        q: 'Who is this event for?',
        a: 'The event is for anyone interested in startups — first-time learners, students, early-stage founders, and experienced professionals looking to network and contribute to regional ecosystem building.',
      },
      {
        q: 'Who organizes this?',
        a: 'The summit is organized by BuildUp Kasaragod, an NGO focused on fostering entrepreneurship and innovation in the Kasaragod district. BuildUp Kasaragod works on grassroots ecosystem development in the North Malabar region.',
      },
    ],
  },
  {
    category: 'Registration & Passes',
    items: [
      {
        q: 'How do I register?',
        a: 'Head to the Register page to see available tiers. We offer Gold Delegate (₹499), Diamond VIP (₹1,499), Bulk Pass (₹3,999 for 10), and Stall Space (₹4,999/booth) options.',
      },
      {
        q: 'What does the Gold Delegate pass include?',
        a: 'The Gold Delegate pass includes full access to the Main Stage sessions, access to all parallel Activity Zones (Snake & Ladder, Debate, Startup Jam), and standard networking opportunities.',
      },
      {
        q: 'What additional benefits does Diamond VIP offer?',
        a: 'Diamond VIP includes priority seating on the Main Stage, VIP Networking Lounge access, private Speaker Q&A sessions, and exclusive summit merchandise.',
      },
      {
        q: 'Can I register as a group?',
        a: 'Yes. The Bulk Pass (₹3,999) includes 10 Gold Delegate passes, fast-track group registration, and a dedicated point-of-contact for assistance. Ideal for colleges and institutions.',
      },
    ],
  },
  {
    category: 'Event Day',
    items: [
      {
        q: 'What time does the event start?',
        a: 'Registration and check-in open at 08:00 AM. The first session, "From Zero to First Step," begins at 08:30 AM. The event runs until 5:30 PM.',
      },
      {
        q: 'What are the Activity Zones?',
        a: 'The summit features four parallel Activity Zones: Startup Snake & Ladder (interactive game), Startup Debate (critical thinking sessions), Startup Jam (rapid ideation activity), and Exhibition Stalls (tribal enterprise, heritage, agri-tech, and student startups).',
      },
      {
        q: 'Will food be provided?',
        a: 'Lunch and refreshments during the designated break (12:25 PM - 1:30 PM) are included. There will also be a tea break at 10:50 AM.',
      },
      {
        q: 'Can I book a stall?',
        a: 'Yes. Stall Space starts at ₹4,999 per booth and includes a 3×3 meter premium space, 2 exhibitor passes, logo placement in the partner directory, and a pitch opportunity.',
      },
    ],
  },
  {
    category: 'Contact & Support',
    items: [
      {
        q: 'How can I contact the organizers?',
        a: 'Email us at contact@buildupkasaragod.org or visit buildupkasaragod.org. Our office is located at Lancof, First Floor, CH Building Complex, Neerchal, Kasaragod – 671323.',
      },
      {
        q: 'Can my organization partner with the summit?',
        a: 'Absolutely. We are actively onboarding ecosystem partners, knowledge partners, and community organizations. Reach out via email for partnership details.',
      },
    ],
  },
];

// Flatten FAQs for JSON-LD structured data
const allFaqs = faqCategories.flatMap((cat) => cat.items);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <>
      {/* FAQ Schema Structured Data (JSON-LD for SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: allFaqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-brand-surface pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 py-1 px-3 border border-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-600 mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-brand-accent" />
              <span>Help Centre</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-brand-ocean tracking-tight uppercase mb-3">
              Frequently Asked <span className="text-brand-accent">Questions</span>
            </h1>
            <p className="text-[15px] text-slate-600 font-medium">
              Everything you need to know about the Coastal Innovation Summit.
            </p>
          </div>

          {/* FAQ Categories */}
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="mb-8">
              <h2 className="text-xs font-bold text-brand-red uppercase tracking-[0.25em] mb-3 pl-1">
                {category.category}
              </h2>
              <div className="border border-slate-200 divide-y divide-slate-200">
                {category.items.map((faq, faqIdx) => {
                  const key = `${catIdx}-${faqIdx}`;
                  const isOpen = openIndex === key;
                  return (
                    <button
                      key={key}
                      onClick={() => toggle(key)}
                      className="w-full text-left p-5 md:p-6 bg-white hover:bg-slate-50 transition-colors duration-100"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-[15px] md:text-base font-bold text-slate-900">{faq.q}</h3>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-10 bg-brand-ocean p-6 md:p-8 text-center">
            <p className="text-slate-300 font-medium text-sm mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-brand-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-teal-600 transition-colors"
            >
              Contact Organizers
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}