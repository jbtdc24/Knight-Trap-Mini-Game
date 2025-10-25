'use client';

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  assets: string[];
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ assets, onLoadingComplete }: LoadingScreenProps) {
  const [loadedAssets, setLoadedAssets] = useState(0);

  useEffect(() => {
    if (!assets || assets.length === 0) {
        onLoadingComplete();
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
      onLoadingComplete();
    }
  }, [loadedAssets, assets.length, onLoadingComplete]);

  const progress = assets.length > 0 ? (loadedAssets / assets.length) * 100 : 100;

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
        <div className="text-white text-4xl font-press-start mb-8">Loading...</div>
        <div className="w-1/2 bg-gray-700 rounded-full h-8">
            <div className="bg-green-500 h-8 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
  );
}
