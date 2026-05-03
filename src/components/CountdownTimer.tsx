import { CalendarDays, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const bankyEase = [0.16, 1, 0.3, 1] as const;

export default function CountdownTimer() {
  const items = [
    { icon: CalendarDays, label: 'Date', value: 'Coming Soon' },
    { icon: MapPin, label: 'Venue', value: 'Kasaragod, Kerala' },
    { icon: Users, label: 'Expected', value: '300+ Attendees' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: bankyEase }}
      className="w-full border-y border-banky-border/40 bg-banky-gold/20"
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: bankyEase }}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 bg-banky-blue/[0.08] border border-banky-blue/10 flex items-center justify-center transition-all duration-500 group-hover:bg-banky-blue/15 group-hover:scale-110">
                <Icon className="w-4 h-4 text-banky-blue" />
              </div>
              <div>
                <p className="text-[10px] text-banky-dark/40 uppercase tracking-[0.2em]">{item.label}</p>
                <p className="text-[14px] text-banky-dark font-medium">{item.value}</p>
              </div>
              {i < 2 && <div className="hidden md:block w-px h-8 bg-banky-border/50 ml-10" />}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
