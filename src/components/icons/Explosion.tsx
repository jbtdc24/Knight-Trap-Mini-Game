import { motion } from 'framer-motion';
import Image from 'next/image';

export const Explosion = () => (
  <motion.div
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 1.5, opacity: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="absolute inset-0 z-10 flex items-center justify-center"
  >
    <Image
      src="/explosion-mark.png"
      alt="Explosion"
      width={60}
      height={60}
      className="object-contain"
    />
  </motion.div>
);
