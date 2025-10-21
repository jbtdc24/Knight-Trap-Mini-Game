import { motion } from 'framer-motion';

export const Explosion = () => (
  <motion.div
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 1.5, opacity: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="absolute inset-0 z-10 flex items-center justify-center"
  >
    <div className="h-full w-full rounded-full bg-accent opacity-80" />
  </motion.div>
);
