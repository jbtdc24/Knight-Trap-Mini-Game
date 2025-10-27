
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useSfx } from "@/hooks/use-sfx";

export default function AuthButton() {
  const { data: session } = useSession();
  const playSound = useSfx();

  const handleSignIn = () => {
    playSound("click");
    signIn("google");
  };

  const handleSignOut = () => {
    playSound("click");
    signOut();
  };

  return (
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
          <span>Welcome, {session.user?.name}</span>
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
  );
}
