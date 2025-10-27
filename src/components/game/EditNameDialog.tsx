
"use client";

import { useState } from "react";
import { useSfx } from "@/hooks/use-sfx";

interface EditNameDialogProps {
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => Promise<boolean>; // Returns a promise that resolves to a boolean for success
}

export default function EditNameDialog({ currentName, onClose, onSave }: EditNameDialogProps) {
  const [newName, setNewName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playSound = useSfx();

  const handleSave = async () => {
    if (newName.length < 3 || newName.length > 20) {
      setError("Name must be between 3 and 20 characters.");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    playSound("click");

    const success = await onSave(newName);

    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative rounded-lg border-4 border-yellow-600 bg-gray-800 p-8 text-white shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Your Name</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="name-input" className="text-sm font-semibold">New Name:</label>
          <input
            id="name-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-gray-900 border-2 border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500"
            maxLength={20}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button 
            onClick={onClose} 
            onMouseEnter={() => playSound('hover')} 
            className="py-2 px-4 rounded hover:bg-gray-700 disabled:opacity-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            onMouseEnter={() => playSound('hover')} 
            className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">&times;</button>
      </div>
    </div>
  );
}
