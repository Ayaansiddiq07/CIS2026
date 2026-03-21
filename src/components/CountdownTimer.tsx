import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const targetDate = new Date('2026-05-10T08:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 py-5 md:py-8 px-4 sm:px-6 md:px-8 bg-white w-full max-w-xl mx-auto rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-lg md:shadow-xl">
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <div key={unit} className="flex items-center">
          <div className="flex flex-col items-center min-w-[50px] sm:min-w-[60px]">
            <span className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-brand-ocean tabular-nums">
              {value.toString().padStart(2, '0')}
            </span>
            <span className="font-sans text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 mt-0.5 font-bold">
              {unit}
            </span>
          </div>
          {index < Object.entries(timeLeft).length - 1 && (
            <span className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-slate-200 ml-2 sm:ml-3 md:ml-5 -translate-y-1">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
