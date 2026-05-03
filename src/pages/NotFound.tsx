import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const bankyEase = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: bankyEase }}
        className="text-center px-5 relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: bankyEase }}
          className="text-[120px] md:text-[160px] font-display font-black text-banky-blue leading-none mb-4"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: bankyEase }}
          className="text-banky-dark/60 text-[17px] mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: bankyEase }}
        >
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-[15px]">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
