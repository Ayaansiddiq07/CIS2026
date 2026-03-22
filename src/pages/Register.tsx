import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Shield, Star, Users, Store, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ── Zod schema (same validation as backend) ──
const registrationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian phone number'),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

type TicketType = 'gold' | 'diamond' | 'bulk' | 'stall';

interface TicketInfo {
  type: TicketType;
  label: string;
  price: string;
  priceNum: number;
  unit: string;
  description: string;
  icon: typeof Star;
  features: string[];
  accentColor: string;
  featured?: boolean;
}

const tickets: TicketInfo[] = [
  {
    type: 'gold',
    label: 'Gold Delegate',
    price: '₹499',
    priceNum: 499,
    unit: '/Person',
    description: 'Standard individual access pass for lean founders and students.',
    icon: Star,
    features: ['Full Access to Main Stage', 'Access to Activity Zones', 'Standard Networking'],
    accentColor: 'brand-accent',
  },
  {
    type: 'diamond',
    label: 'Diamond VIP',
    price: '₹1,499',
    priceNum: 1499,
    unit: '/Person',
    description: 'Premium experience for investors and established pros.',
    icon: Shield,
    features: ['Priority Seating on Main Stage', 'VIP Networking Lounge Access', 'Private Speaker Q&A', 'Exclusive Merchandise'],
    accentColor: 'brand-accent',
    featured: true,
  },
  {
    type: 'bulk',
    label: 'Bulk Pass',
    price: '₹3,999',
    priceNum: 3999,
    unit: '/10 Passes',
    description: 'Designed for institutions, colleges, and corporate teams.',
    icon: Users,
    features: ['10x Gold Delegate Passes', 'Fast-track Group Registration', 'Dedicated POC Assistance'],
    accentColor: 'brand-red',
  },
  {
    type: 'stall',
    label: 'Stall Space',
    price: '₹4,999',
    priceNum: 4999,
    unit: '/Booth',
    description: 'Showcase your startup, rural enterprise, or tech project.',
    icon: Store,
    features: ['3x3 Meter Premium Stall Space', '2x Exhibitor Passes', 'Logo in Partner Directory', 'Pitch Opportunity'],
    accentColor: 'brand-ocean',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

export default function Register() {
  const [selectedTicket, setSelectedTicket] = useState<TicketInfo | null>(null);
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  function openModal(ticket: TicketInfo) {
    setSelectedTicket(ticket);
    setStep('form');
    setErrorMsg('');
    reset();
  }

  function closeModal() {
    setSelectedTicket(null);
    setStep('form');
    setErrorMsg('');
  }

  async function onSubmit(data: RegistrationForm) {
    if (!selectedTicket) return;
    setStep('processing');
    setErrorMsg('');

    try {
      // 1. Create order on backend
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ticketType: selectedTicket.type }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(errBody.error || 'Failed to create order');
      }

      const order = await res.json();

      // 2. If test mode (dummy Razorpay keys), skip checkout — already processed
      if (order.testMode) {
        console.log('🧪 Test mode: payment auto-processed, skipping Razorpay');
        setStep('success');
        return;
      }

      // 3. Open Razorpay checkout (production mode)
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Payment gateway is loading. Please try again in a moment.');
      }

      const razorpay = new window.Razorpay({
        key: order.key || 'rzp_test_xxxxxxxxxxxx',
        amount: order.amount,
        currency: order.currency,
        name: 'Coastal Innovation Summit',
        description: `${selectedTicket.label} Registration`,
        order_id: order.orderId,
        handler: function () {
          setStep('success');
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: '#0a2540' },
        modal: {
          ondismiss: function () {
            setStep('form');
          },
        },
      });

      razorpay.on('payment.failed', function () {
        setErrorMsg('Payment failed. Your money was not deducted. Please try again.');
        setStep('error');
      });

      razorpay.open();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-block py-1 px-4 border border-brand-accent text-brand-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            Passes Now Available
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-brand-ocean tracking-tight uppercase mb-4">
            CHOOSE YOUR <span className="text-brand-accent">EXPERIENCE</span>
          </h1>
          <p className="text-slate-600 font-medium text-base max-w-xl mx-auto">
            Select the delegate pass that best fits your goals for the Coastal Innovation Summit.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {tickets.map((ticket) => {
            const Icon = ticket.icon;
            const isFeatured = ticket.featured;

            return (
              <motion.div
                key={ticket.type}
                variants={cardVariants}
                className={`p-6 border relative flex flex-col group transition-all ${
                  isFeatured
                    ? 'bg-brand-ocean border-brand-accent shadow-[0_10px_40px_rgba(13,162,146,0.15)] transform md:-translate-y-4 z-10'
                    : 'bg-white border-slate-200 hover:border-brand-accent hover:shadow-xl'
                }`}
              >
                {isFeatured && (
                  <div className="absolute top-0 right-0 bg-brand-accent text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 m-3">
                    Most Popular
                  </div>
                )}
                <div className={`w-10 h-10 flex items-center justify-center mb-5 transition-colors ${
                  isFeatured ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-brand-accent'
                }`}>
                  <Icon className={`w-5 h-5 transition-colors ${
                    isFeatured ? 'text-brand-accent' : 'text-slate-700 group-hover:text-white'
                  }`} />
                </div>
                <h3 className={`text-xl font-bold font-display uppercase tracking-wide mb-1 ${
                  isFeatured ? 'text-white' : 'text-slate-900'
                }`}>{ticket.label}</h3>
                <p className={`text-[13px] font-medium mb-6 ${
                  isFeatured ? 'text-slate-400' : 'text-slate-500'
                }`}>{ticket.description}</p>
                <div className="mb-6">
                  <span className={`text-3xl font-black ${isFeatured ? 'text-white' : 'text-brand-ocean'}`}>
                    {ticket.price}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                    isFeatured ? 'text-slate-500' : 'text-slate-400'
                  }`}>{ticket.unit}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {ticket.features.map((feature, i) => (
                    <li key={i} className={`flex items-start gap-2 text-[13px] font-medium ${
                      isFeatured ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isFeatured ? 'text-brand-accent' : `text-${ticket.accentColor}`
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openModal(ticket)}
                  id={`select-${ticket.type}`}
                  className={`w-full py-3 text-center font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                    isFeatured
                      ? 'bg-brand-accent text-white hover:bg-white hover:text-brand-ocean'
                      : ticket.type === 'stall'
                        ? 'bg-slate-200 text-slate-800 hover:bg-brand-ocean hover:text-white'
                        : ticket.type === 'bulk'
                          ? 'bg-brand-ocean text-white hover:bg-brand-red'
                          : 'bg-brand-ocean text-white hover:bg-brand-accent'
                  }`}
                >
                  Select {ticket.label.split(' ')[0]}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 font-medium">Need something custom or have sponsorship questions?</p>
          <Link to="/contact" className="inline-block mt-4 font-bold text-brand-accent hover:text-brand-ocean tracking-wide underline decoration-2 underline-offset-4">Contact Organizers</Link>
        </motion.div>
      </div>

      {/* ── Registration Modal ── */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-md relative"
            >
              {/* Header */}
              <div className="bg-brand-ocean px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-display font-bold text-lg uppercase tracking-wide">
                    {selectedTicket.label}
                  </h2>
                  <p className="text-brand-accent text-sm font-bold">{selectedTicket.price} {selectedTicket.unit}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  id="close-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {step === 'form' && (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="9876543210"
                        className="w-full px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="submit-registration"
                      className="w-full py-3.5 bg-brand-accent text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-ocean transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                    >
                      {isSubmitting ? 'Processing...' : `Pay ${selectedTicket.price}`}
                    </button>

                    <p className="text-[11px] text-slate-400 text-center font-medium">
                      Secured by Razorpay. Your details are encrypted.
                    </p>
                  </form>
                )}

                {step === 'processing' && (
                  <div className="py-12 text-center">
                    <Loader2 className="w-10 h-10 text-brand-accent animate-spin mx-auto mb-4" />
                    <p className="text-slate-700 font-bold text-sm">Opening payment gateway...</p>
                    <p className="text-slate-400 text-xs mt-1">Do not close this window</p>
                  </div>
                )}

                {step === 'success' && (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Registration Confirmed!</h3>
                    <p className="text-slate-500 text-sm font-medium mb-1">
                      Your {selectedTicket.label} pass has been booked successfully.
                    </p>
                    <p className="text-slate-400 text-xs mb-6">
                      Check your email for the QR code and confirmation details.
                    </p>
                    <button
                      onClick={closeModal}
                      className="px-8 py-3 bg-brand-ocean text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}

                {step === 'error' && (
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Something Went Wrong</h3>
                    <p className="text-red-500 text-sm font-medium mb-6">{errorMsg}</p>
                    <button
                      onClick={() => setStep('form')}
                      className="px-8 py-3 bg-brand-ocean text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors cursor-pointer"
                    >
                      Try Again
                    </button>
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