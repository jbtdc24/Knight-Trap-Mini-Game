
"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSfx } from "@/hooks/use-sfx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileDialog from "./EditProfileDialog"; // Import the dialog

export default function AuthButton() {
  const { data: session } = useSession();
  const playSound = useSfx();

  // State for the dialog and user image
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    // Set the initial image from the session
    if (session?.user?.image) {
      setUserImage(session.user.image);
    }
  }, [session]);

  const handleSignIn = () => {
    playSound("click");
    signIn("google");
  };

  const handleSignOut = () => {
    playSound("click");
    signOut();
  };

  const handleSaveProfile = (newImage: string) => {
    // Update the image in the state (front-end only for now)
    setUserImage(newImage);
  };

  return (
    <>
      <div
        className="absolute top-4 left-4 z-50 text-white font-bold py-2 px-4 rounded"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          border: "2px solid #a56c3a",
          boxShadow: "0 0 10px #a56c3a",
        }}
      >
        {session ? (
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8 border-2 border-yellow-700">
              <AvatarImage src={userImage ?? undefined} alt={session.user?.name ?? ''} />
              <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>Welcome, {session.user?.name}</span>
            <button
              onClick={() => setShowEditDialog(true)}
              className="hover:underline text-sm font-normal"
              onMouseEnter={() => playSound("hover")}
            >
              Edit
            </button>
            <button
              onClick={handleSignOut}
              className="hover:underline"
              onMouseEnter={() => playSound("hover")}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="hover:underline"
            onMouseEnter={() => playSound("hover")}
          >
            Signin/Sign up
          </button>
        )}
      </div>

      {/* Render the dialog when showEditDialog is true */}
      {showEditDialog && (
        <EditProfileDialog
          currentImage={userImage}
          onClose={() => setShowEditDialog(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}
