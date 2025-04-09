"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PendingRequestPage() {
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/check-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.status === "approved") {
          router.push("/dashboard");
        } else if (data.status === "declined") {
          // Clear local storage since user was deleted
          localStorage.clear();
          router.push("/proposal-declined");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-indigo-400 text-white text-center text-2xl p-6">
      Your friend request to the King is pending 👑💌<br />
      The King will become your friend soon!
    </div>
  );
}
