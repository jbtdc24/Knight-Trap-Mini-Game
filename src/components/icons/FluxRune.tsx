import { motion } from 'framer-motion';

export const FluxRune = () => (
  <motion.div
    className="rounded-full flex items-center justify-center"
    style={{ 
      background: 'radial-gradient(circle, #DA70D6, #8A2BE2)', 
      boxShadow: '0 0 15px #DA70D6, 0 0 25px #8A2BE2'
    }}
    animate={{
      scale: [1, 1.1, 1],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <svg width="70%" height="70%" viewBox="0 0 100 100">
      <motion.path
        d="M 50,10 A 40,40 0 1,1 50,90 A 40,40 0 1,1 50,10 Z"
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeDasharray="10,5"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.path
        d="M 30,30 L 70,70 M 70,30 L 30,70"
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        animate={{
          scale: [1, 0.8, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </svg>
  </motion.div>
);
