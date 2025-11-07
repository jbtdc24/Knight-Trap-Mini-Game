'use client';

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  assets: string[];
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ assets, onLoadingComplete }: LoadingScreenProps) {
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!assets || assets.length === 0) {
        setIsLoaded(true);
        return;
    }

    assets.forEach(asset => {
        const lowerCaseAsset = asset.toLowerCase();
        if (lowerCaseAsset.endsWith('.png') || lowerCaseAsset.endsWith('.jpg') || lowerCaseAsset.endsWith('.jpeg') || lowerCaseAsset.endsWith('.gif')) {
            const img = new Image();
            img.src = asset;
            img.onload = () => {
                setLoadedAssets(prev => prev + 1);
            };
        } else if (lowerCaseAsset.endsWith('.mp3')) {
            const audio = new Audio();
            audio.src = asset;
            audio.oncanplaythrough = () => {
                setLoadedAssets(prev => prev + 1);
            };
        }
    });
  }, [assets]);

  useEffect(() => {
    if (loadedAssets === assets.length) {
      setIsLoaded(true);
    }
  }, [loadedAssets, assets.length]);
  
  useEffect(() => {
    if (isLoaded) {
      const handleEnter = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          onLoadingComplete();
        }
      };
      window.addEventListener('keydown', handleEnter);
      return () => {
        window.removeEventListener('keydown', handleEnter);
      };
    }
  }, [isLoaded, onLoadingComplete]);

  const progress = assets.length > 0 ? (loadedAssets / assets.length) * 100 : 100;

  return (
    <div 
      className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/enterdungeon.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center justify-center text-white">
        {!isLoaded ? (
          <>
            <div className="text-4xl font-press-start mb-8">Loading...</div>
            <div className="w-full max-w-md bg-gray-700 rounded-full h-8">
              <div className="bg-green-500 h-8 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </>
        ) : (
          <button 
            className="text-5xl font-press-start animate-pulse"
            onClick={onLoadingComplete}
          >
            - ENTER -
          </button>
        )}
      </div>
    </div>
  );
}
