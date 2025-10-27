
"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSfx } from "@/hooks/use-sfx";
import EditNameDialog from "./EditNameDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Keep avatar for display

export default function AuthButton() {
  // The useSession hook now returns a status and an update function
  const { data: session, status, update } = useSession();
  const playSound = useSfx();

  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSignIn = () => {
    playSound("click");
    signIn("google");
  };

  const handleSignOut = () => {
    playSound("click");
    signOut();
  };

  // This function sends the new name to our secure API endpoint
  const handleSaveName = async (newName: string) => {
    const response = await fetch('/api/user/update-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newName }),
    });

    if (response.ok) {
      // If the API call is successful, we trigger the session update.
      // NextAuth will refetch the session, and our custom callback will load the new name.
      await update();
      return true; // Indicate success
    } else {
      // Handle errors from the API if needed
      console.error("Failed to update name");
      return false; // Indicate failure
    }
  };

  // We show a loading state while the session is being fetched
  if (status === "loading") {
    return (
        <div 
            className="absolute top-4 left-4 z-50 text-white font-bold py-2 px-4 rounded"
            style={{
                background: "rgba(0, 0, 0, 0.5)",
                border: "2px solid #a56c3a",
                boxShadow: "0 0 10px #a56c3a",
            }}
        >
            Loading...
        </div>
    );
  }

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
            {/* We can still show the Google picture, just not edit it */}
            <Avatar className="h-8 w-8 border-2 border-yellow-700">
                <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? ''} />
                <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>Welcome, {session.user?.name}</span>
            <button
              onClick={() => setShowEditDialog(true)}
              className="hover:underline text-sm font-normal"
              onMouseEnter={() => playSound("hover")}
            >
              Edit Name
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
            Sign in / Sign up
          </button>
        )}
      </div>

      {/* Render the new EditNameDialog */}
      {showEditDialog && session?.user?.name && (
        <EditNameDialog
          currentName={session.user.name}
          onClose={() => setShowEditDialog(false)}
          onSave={handleSaveName}
        />
      )}
    </>
  );
}
