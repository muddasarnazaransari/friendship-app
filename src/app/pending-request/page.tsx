'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PendingRequestPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get user email securely from /api/me
    const getUser = async () => {
      try {
        const res = await fetch('/api/admin/me');
        if (!res.ok) throw new Error('Failed to fetch user');
        const user = await res.json();
        setEmail(user.email);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!email) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.status === 'approved') {
          router.push('/dashboard');
        } else if (data.status === 'declined') {
          router.push('/proposal-declined');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [email, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-indigo-400 text-white text-center text-2xl p-6">
      Your friend request to the Muddasar is pending 👑💌<br />
      The Muddasar will become your friend soon!
    </div>
  );
}
