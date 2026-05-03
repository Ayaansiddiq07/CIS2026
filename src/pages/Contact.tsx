import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Globe, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import BankyTextReveal from '../components/BankyTextReveal';

const bankyEase = [0.16, 1, 0.3, 1] as const;

const contactSchema = z.object({ name: z.string().trim().min(1, 'Required').max(100), email: z.string().trim().toLowerCase().email('Invalid email'), subject: z.string().trim().min(1, 'Required').max(200), message: z.string().trim().min(1, 'Required').max(2000) });
type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactForm) {
    setError('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json().catch(() => ({ error: 'Server error' })); throw new Error(e.error || 'Failed'); }
      setSubmitted(true); reset();
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong'); }
  }

  return (
    <div className="min-h-screen bg-white pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: bankyEase }}>
          <p className="text-banky-blue text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-banky-blue inline-block" />Get in touch
          </p>
          <h1 className="text-3xl md:text-[44px] font-display font-bold text-banky-dark mb-4 leading-tight">
            <BankyTextReveal text="Contact Us" by="char" delay={0.08} />
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[16px] text-banky-dark/50 mb-10">Have questions? Reach out to us.</motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6, ease: bankyEase }}
            className="flex flex-wrap gap-6 mb-10 text-[14px]">
            <a href="mailto:info@cis2026.com" className="text-banky-dark/60 hover:text-banky-blue transition-colors duration-300 flex items-center gap-2 hover-underline"><Mail className="w-4 h-4 text-banky-dark/40" /> info@cis2026.com</a>
            <a href="https://www.buildupkasaragod.org" target="_blank" rel="noreferrer" className="text-banky-dark/60 hover:text-banky-blue transition-colors duration-300 flex items-center gap-2 hover-underline"><Globe className="w-4 h-4 text-banky-dark/40" /> buildupkasaragod.org</a>
            <span className="text-banky-dark/60 flex items-center gap-2"><MapPin className="w-4 h-4 text-banky-dark/40" /> Kasaragod, Kerala</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: bankyEase }}
            className="banky-card p-6 md:p-8">
            <h2 className="text-lg font-display font-semibold text-banky-dark mb-6">Send us a message</h2>
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: bankyEase }} className="py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-banky-blue mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-banky-dark mb-1">Message Sent</h3>
                <p className="text-banky-dark/50 text-[14px] mb-6">We will get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary px-5 py-2.5 font-semibold text-[14px] cursor-pointer">Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[13px] font-medium text-banky-dark/60 mb-1.5">Your Name</label>
                    <input id="contact-name" type="text" {...register('name')} placeholder="Full name" className="banky-input" />
                    {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-[13px] font-medium text-banky-dark/60 mb-1.5">Email</label>
                    <input id="contact-email" type="email" {...register('email')} placeholder="you@example.com" className="banky-input" />
                    {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-[13px] font-medium text-banky-dark/60 mb-1.5">Subject</label>
                  <input id="contact-subject" type="text" {...register('subject')} placeholder="What is this about?" className="banky-input" />
                  {errors.subject && <p className="text-red-500 text-[12px] mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-[13px] font-medium text-banky-dark/60 mb-1.5">Message</label>
                  <textarea id="contact-message" rows={5} {...register('message')} placeholder="Tell us what you need..." className="banky-input resize-none" />
                  {errors.message && <p className="text-red-500 text-[12px] mt-1">{errors.message.message}</p>}
                </div>
                {error && <p className="text-red-500 text-[14px] bg-red-500/[0.08] p-3 border border-red-500/15">{error}</p>}
                <button type="submit" disabled={isSubmitting} id="submit-contact" className="btn-primary w-full md:w-auto px-7 py-3.5 font-semibold text-[14px] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
