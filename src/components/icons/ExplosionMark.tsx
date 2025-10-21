'use client';

import { motion } from 'framer-motion';

export const ExplosionMark = () => (
  <motion.div
    className="absolute inset-0 z-0 flex items-center justify-center"
  >
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-black/40"
    >
        <path 
            d="M12 3C11.3333 7.66667 13.6 9.6 15 10M12 3C14.5 6.5 16.5 7.5 17 8.5M12 3C10.5 5.5 8.5 7.5 8 9" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M21 12C16.3333 11.3333 14.4 13.6 14 15M21 12C17.5 14.5 16.5 16.5 15.5 17M21 12C18.5 10.5 16.5 8.5 15 8" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M12 21C11.3333 16.3333 13.6 14.4 15 14M12 21C14.5 17.5 16.5 16.5 17 15.5M12 21C10.5 18.5 8.5 16.5 8 15" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M3 12C7.66667 11.3333 9.6 13.6 10 15M3 12C6.5 14.5 7.5 16.5 8.5 17M3 12C5.5 10.5 7.5 8.5 9 8" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
  </motion.div>
);
