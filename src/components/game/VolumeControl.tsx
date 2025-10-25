'use client';

import { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';

export default function VolumeControl() {
  const { musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full bg-gray-800 text-white">
        {musicVolume > 0 || sfxVolume > 0 ? <Volume2 /> : <VolumeX />}
      </button>
      {isOpen && (
        <div className="absolute top-12 right-0 bg-gray-800 p-4 rounded-lg shadow-lg w-48">
          <div className="mb-4">
            <label className="text-white mb-2 block">Music</label>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[musicVolume]}
              onValueChange={(value) => setMusicVolume(value[0])}
            />
          </div>
          <div>
            <label className="text-white mb-2 block">SFX</label>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[sfxVolume]}
              onValueChange={(value) => setSfxVolume(value[0])}
            />
          </div>
        </div>
      )}
    </div>
  );
}
