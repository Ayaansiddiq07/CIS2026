import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Globe, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactForm) {
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(errBody.error || 'Failed to submit');
      }

      setSubmitted(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-display font-black text-brand-ocean tracking-tight uppercase mb-4">
            Contact <span className="text-brand-accent">Us</span>
          </h1>
          <p className="text-[15px] text-slate-600 font-medium mb-10">
            Have questions about the Coastal Innovation Summit? Reach out to us.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 bg-slate-200 mb-12">
            <div className="bg-white p-6 md:p-8 flex flex-col gap-3">
              <Mail className="w-5 h-5 text-brand-accent" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Email</h3>
              <a href="mailto:info@cis2026.com" className="text-[15px] text-slate-600 font-medium hover:text-brand-accent transition-colors break-all">
                info@cis2026.com
              </a>
            </div>
            <div className="bg-white p-6 md:p-8 flex flex-col gap-3 border-t border-slate-200 md:border-t-0 md:border-l">
              <Globe className="w-5 h-5 text-brand-accent" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Website</h3>
              <a href="https://www.buildupkasaragod.org" target="_blank" rel="noreferrer" className="text-[15px] text-slate-600 font-medium hover:text-brand-accent transition-colors">
                buildupkasaragod.org
              </a>
            </div>
            <div className="bg-white p-6 md:p-8 flex flex-col gap-3 border-t border-slate-200 md:border-t-0 md:border-l">
              <MapPin className="w-5 h-5 text-brand-accent" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Address</h3>
              <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
                Lancof, First Floor, CH Building Complex, Neerchal, Kasaragod – 671323
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white border border-slate-200 p-6 md:p-8"
          >
            <h2 className="text-lg font-display font-bold text-brand-ocean uppercase tracking-wide mb-6">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">
                  Thank you for reaching out. We will get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-brand-ocean text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      {...register('name')}
                      placeholder="Full name"
                      className="w-full px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      {...register('email')}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    {...register('subject')}
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1 font-medium">{errors.subject.message}</p>}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    {...register('message')}
                    placeholder="Tell us what you need..."
                    className="w-full px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message.message}</p>}
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium bg-red-50 p-3 border border-red-200">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-contact"
                  className="w-full md:w-auto px-8 py-3.5 bg-brand-accent text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-ocean transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}