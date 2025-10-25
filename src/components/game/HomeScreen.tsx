'use client';

import { useState } from 'react';
import HowToPlayDialog from './HowToPlayDialog';

export default function HomeScreen({ onPlayClick }: { onPlayClick: () => void }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <>
      <div 
        className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/home-background.png')" }}
      >
        <div className="flex flex-col items-center gap-12 mb-20">
          <img src="/Logo 8bit.png" alt="Logo" className="w-80 sm:w-96 md:w-[500px]" />
          
          <div className="flex flex-col items-center gap-4">
            <img 
             src="/Playbutton.png" 
             alt="Play" 
             className="cursor-pointer h-20 sm:h-24 md:h-28 transition-transform hover:scale-105"
             onClick={onPlayClick} 
           />
            <button 
              onClick={() => setShowHowToPlay(true)}
              className="text-white text-lg sm:text-xl md:text-2xl font-bold bg-black bg-opacity-50 px-6 py-2 rounded-lg transition-colors hover:bg-opacity-75"
            >
              How to Play
            </button>
          </div>
        </div>
      </div>
      {showHowToPlay && <HowToPlayDialog onClose={() => setShowHowToPlay(false)} />}
    </>
  );
}