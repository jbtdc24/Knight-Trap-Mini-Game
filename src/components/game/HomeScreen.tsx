'use client';

import { useState, useEffect, useRef } from 'react';
import HowToPlayDialog from './HowToPlayDialog';
import { useAudio } from '@/context/AudioContext';
import { useSfx } from '@/hooks/use-sfx';

export default function HomeScreen({ onPlayClick }: { onPlayClick: () => void }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { musicVolume } = useAudio();
  const playSound = useSfx();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.volume = musicVolume;
      audio.play().catch(e => {
        console.error("Audio play failed:", e);
      });
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [musicVolume]);

  return (
    <>
      <audio ref={audioRef} src="/sfx/HomeScreen.MP3" preload="auto"></audio>
      <div 
        className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/home-background.png')" }}
      >
        <div className="flex flex-col items-center gap-12 mb-20">
          <img src="/Logo 8bit.png" alt="Logo" className="w-[461px] sm:w-[538px] md:w-[720px]" />
          
          <div className="flex flex-col items-center gap-4">
            <img 
             src="/Playbutton.png" 
             alt="Play" 
             className="cursor-pointer h-20 sm:h-24 md:h-28 transition-transform hover:scale-105"
             onClick={onPlayClick}
             onMouseEnter={() => playSound('hover')}
             onMouseDown={() => playSound('click')}
           />
            <img 
              src="/howto.png" 
              alt="How to Play"
              className="cursor-pointer h-12 sm:h-16 transition-transform hover:scale-105"
              onClick={() => setShowHowToPlay(true)}
              onMouseEnter={() => playSound('hover')}
              onMouseDown={() => playSound('click')}
            />
          </div>
        </div>
      </div>
      {showHowToPlay && <HowToPlayDialog onClose={() => setShowHowToPlay(false)} />}
    </>
  );
}