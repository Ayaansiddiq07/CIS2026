import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Shield, Star, Users, Store, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import BankyTextReveal from '../components/BankyTextReveal';

const bankyEase = [0.16, 1, 0.3, 1] as const;

const registrationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian phone number'),
});
type RegistrationForm = z.infer<typeof registrationSchema>;
type TicketType = 'gold' | 'diamond' | 'bulk' | 'stall';

interface TicketInfo {
  type: TicketType; label: string; price: string; priceNum: number; unit: string;
  description: string; icon: typeof Star; features: string[]; featured?: boolean;
}

const defaultTickets: TicketInfo[] = [
  { type: 'gold', label: 'Gold Delegate', price: '₹499', priceNum: 499, unit: '/person', description: 'Standard individual access for lean founders and students.', icon: Star,
    features: ['Full Access to Main Stage', 'Access to Activity Zones', 'Standard Networking'] },
  { type: 'diamond', label: 'Diamond VIP', price: '₹1,499', priceNum: 1499, unit: '/person', description: 'Premium experience for investors and established pros.', icon: Shield, featured: true,
    features: ['Priority Seating on Main Stage', 'VIP Networking Lounge', 'Private Speaker Q&A', 'Exclusive Merchandise'] },
  { type: 'bulk', label: 'Bulk Pass', price: '₹3,999', priceNum: 3999, unit: '/10 passes', description: 'Designed for institutions, colleges, and teams.', icon: Users,
    features: ['10x Gold Delegate Passes', 'Fast-track Group Registration', 'Dedicated POC Assistance'] },
  { type: 'stall', label: 'Stall Space', price: '₹4,999', priceNum: 4999, unit: '/booth', description: 'Showcase your startup or enterprise.', icon: Store,
    features: ['3x3m Premium Stall Space', '2x Exhibitor Passes', 'Logo in Partner Directory', 'Pitch Opportunity'] },
];

const iconMap: Record<TicketType, typeof Star> = { gold: Star, diamond: Shield, bulk: Users, stall: Store };
const overlayV: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modalV: Variants = { hidden: { opacity: 0, scale: 0.92, y: 30 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }, exit: { opacity: 0, scale: 0.92, y: 30 } };
const staggerC = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const staggerI = { hidden: { opacity: 0, y: 40, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: bankyEase } } };

export default function Register() {
  const [tickets, setTickets] = useState<TicketInfo[]>(defaultTickets);
  const [selectedTicket, setSelectedTicket] = useState<TicketInfo | null>(null);
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegistrationForm>({ resolver: zodResolver(registrationSchema) });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          if (data.pricing) {
            const types: TicketType[] = ['gold', 'diamond', 'bulk', 'stall'];
            setTickets(types.map(t => {
              const p = data.pricing[t]; const def = defaultTickets.find(d => d.type === t)!;
              return { ...def, label: p?.label || def.label, price: p?.priceDisplay || def.price, priceNum: p?.price || def.priceNum, unit: p?.unit || def.unit, description: p?.description || def.description, features: p?.features?.length ? p.features : def.features, featured: p?.featured ?? def.featured, icon: iconMap[t] };
            }));
          }
        }
      } catch {}
    })();
  }, []);

  function openModal(ticket: TicketInfo) { setSelectedTicket(ticket); setStep('form'); setErrorMsg(''); setIsDuplicate(false); reset(); }
  function closeModal() { setSelectedTicket(null); setStep('form'); setErrorMsg(''); setIsDuplicate(false); }

  async function onSubmit(data: RegistrationForm) {
    if (!selectedTicket) return;
    setStep('processing'); setErrorMsg(''); setIsDuplicate(false);
    try {
      const res = await fetch('/api/payment/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, ticketType: selectedTicket.type }) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }));
        if (res.status === 409) { setStep('error'); setIsDuplicate(true); setErrorMsg(err.error || 'Already registered.'); return; }
        throw new Error(err.error || 'Failed to create order');
      }
      const order = await res.json();
      if (order.testMode) { setStep('success'); return; }
      if (typeof window.Razorpay === 'undefined') throw new Error('Payment gateway loading. Try again.');
      const razorpay = new window.Razorpay({
        key: order.key || 'rzp_test_xxxxxxxxxxxx', amount: order.amount, currency: order.currency,
        name: 'Coastal Innovation Summit', description: `${selectedTicket.label} Registration`, order_id: order.orderId,
        handler: () => setStep('success'),
        prefill: { name: data.name, email: data.email, contact: data.phone },
        theme: { color: '#1B3FE4' },
        modal: { ondismiss: () => setStep('form') },
      });
      razorpay.on('payment.failed', () => { setErrorMsg('Payment failed. Money not deducted.'); setStep('error'); });
      razorpay.open();
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : 'Something went wrong'); setStep('error'); }
  }

  return (
    <div className="min-h-screen bg-banky-yellow pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: bankyEase }} className="text-center mb-14">
          <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">Registration</p>
          <h1 className="text-3xl md:text-[44px] font-display font-bold text-banky-dark mb-5 leading-tight">
            <BankyTextReveal text="Choose Your Pass" by="char" delay={0.08} />
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-banky-dark/50 text-[16px] max-w-lg mx-auto">Select the delegate pass that best fits your goals.</motion.p>
        </motion.div>

        <motion.div variants={staggerC} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tickets.map((ticket) => {
            const Icon = ticket.icon;
            const isFeatured = ticket.featured;
            return (
              <motion.div key={ticket.type} variants={staggerI}
                className={`card-hover flex flex-col p-7 rounded-2xl relative overflow-hidden ${isFeatured ? 'banky-card border-banky-blue/25 shadow-lg shadow-banky-blue/5' : 'banky-card'}`}
              >
                {isFeatured && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-banky-blue/50 to-transparent" />}
                {isFeatured && <p className="text-[11px] text-banky-blue font-semibold uppercase tracking-[0.2em] mb-3">Most Popular</p>}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${isFeatured ? 'bg-banky-blue/[0.08] border border-banky-blue/15' : 'bg-banky-yellow/60 border border-banky-border/30'}`}>
                  <Icon className={`w-5 h-5 ${isFeatured ? 'text-banky-blue' : 'text-banky-dark/40'}`} />
                </div>
                <h3 className="text-lg font-bold font-display text-banky-dark mb-1">{ticket.label}</h3>
                <p className="text-[13px] mb-5 leading-relaxed text-banky-dark/50">{ticket.description}</p>
                <div className="mb-5">
                  <span className={`text-3xl font-bold font-display ${isFeatured ? 'text-gradient' : 'text-banky-dark'}`}>{ticket.price}</span>
                  <span className="text-[12px] ml-1 text-banky-dark/40">{ticket.unit}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-grow">
                  {ticket.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-banky-dark/60">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-banky-blue" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openModal(ticket)} id={`select-${ticket.type}`}
                  className={`w-full py-3.5 text-center font-semibold text-[14px] rounded-full transition-all duration-500 cursor-pointer ${
                    isFeatured ? 'btn-primary' : 'bg-banky-yellow/60 text-banky-dark border-2 border-banky-dark/20 hover:border-banky-blue hover:text-banky-blue'
                  }`}
                >Select</button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: bankyEase }}
          className="mt-14 rounded-2xl p-7 md:p-10 text-center bg-banky-dark">
          <p className="text-white/50 text-[14px] mb-3">Need something custom or have sponsorship questions?</p>
          <Link to="/contact" className="btn-primary inline-block px-6 py-3 font-semibold text-[14px] rounded-full">Contact Organizers</Link>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div variants={overlayV} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div variants={modalV} initial="hidden" animate="visible" exit="exit" className="banky-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-banky-border/30">
              <div className="bg-banky-gold/30 px-6 py-5 flex items-center justify-between border-b border-banky-border/20">
                <div>
                  <h2 className="text-banky-dark font-display font-bold text-lg">{selectedTicket.label}</h2>
                  <p className="text-banky-blue text-[14px] font-semibold">{selectedTicket.price} {selectedTicket.unit}</p>
                </div>
                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-banky-dark/40 hover:text-banky-dark transition-colors cursor-pointer" id="close-modal">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {step === 'form' && (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-[13px] font-medium text-banky-dark/60 mb-1.5">Full Name *</label>
                      <input id="name" type="text" {...register('name')} placeholder="Enter your full name" className="banky-input" />
                      {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[13px] font-medium text-banky-dark/60 mb-1.5">Email *</label>
                      <input id="email" type="email" {...register('email')} placeholder="you@example.com" className="banky-input" />
                      {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-[13px] font-medium text-banky-dark/60 mb-1.5">Phone *</label>
                      <input id="phone" type="tel" {...register('phone')} placeholder="9876543210" className="banky-input" />
                      {errors.phone && <p className="text-red-500 text-[12px] mt-1">{errors.phone.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} id="submit-registration"
                      className="btn-primary w-full py-3.5 font-semibold text-[14px] rounded-full disabled:opacity-50 cursor-pointer mt-2"
                    >{isSubmitting ? 'Processing...' : `Pay ${selectedTicket.price}`}</button>
                    <p className="text-[11px] text-banky-dark/40 text-center">Secured by Razorpay. Details are encrypted.</p>
                  </form>
                )}
                {step === 'processing' && (
                  <div className="py-12 text-center">
                    <Loader2 className="w-8 h-8 text-banky-blue animate-spin mx-auto mb-3" />
                    <p className="text-banky-dark font-semibold text-[14px]">Opening payment gateway...</p>
                    <p className="text-banky-dark/40 text-[12px] mt-1">Do not close this window</p>
                  </div>
                )}
                {step === 'success' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                    <CheckCircle2 className="w-8 h-8 text-banky-blue mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-banky-dark mb-2">Registration Confirmed!</h3>
                    <p className="text-banky-dark/50 text-[14px] mb-1">Your {selectedTicket.label} pass is booked.</p>
                    <p className="text-banky-dark/40 text-[12px] mb-6">Check email for QR code and details.</p>
                    <button onClick={closeModal} className="btn-primary px-6 py-3 font-semibold text-[14px] rounded-full cursor-pointer">Done</button>
                  </motion.div>
                )}
                {step === 'error' && (
                  <div className="py-12 text-center">
                    <X className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-banky-dark mb-2">{isDuplicate ? 'Already Registered' : 'Something Went Wrong'}</h3>
                    <p className="text-red-500 text-[14px] mb-6">{errorMsg}</p>
                    <button onClick={() => setStep('form')} className="px-6 py-3 bg-banky-yellow text-banky-dark font-semibold text-[14px] rounded-full border-2 border-banky-dark/20 hover:border-banky-blue cursor-pointer transition-all duration-500">Try Again</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}