
"use client";

import { useState } from "react";
import { useSfx } from "@/hooks/use-sfx";

interface EditProfileDialogProps {
  onClose: () => void;
  onSave: (newImage: string) => void;
  currentImage: string;
}

export default function EditProfileDialog({ onClose, onSave, currentImage }: EditProfileDialogProps) {
  const [newImage, setNewImage] = useState(currentImage);
  const playSound = useSfx();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    playSound("click");
    onSave(newImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative rounded-lg border-4 border-yellow-600 bg-gray-800 p-8 text-white shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <div className="flex flex-col items-center gap-4">
          <img src={newImage} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover" />
          <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} onMouseEnter={() => playSound('hover')} className="py-2 px-4 rounded hover:bg-gray-700">Cancel</button>
          <button onClick={handleSave} onMouseEnter={() => playSound('hover')} className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded">Save</button>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">&times;</button>
      </div>
    </div>
  );
}
