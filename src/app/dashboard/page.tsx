'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Friend {
  _id: string;
  name: string;
  email: string;
  mobile: string;
}

export default function UserDashboard() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch('/api/user/friends'); // Replace with actual API to fetch user friends

      if (!res.ok) {
        console.error("Error fetching friends:", res.statusText);
        return;
      }

      const { friends } = await res.json();
      setFriends(friends);
      setLoading(false);
    };

    fetchFriends();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f0f4f8] text-black font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2e2e3f] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-8 text-white">Your Profile 🧑‍💻</h1>
          <p className="text-gray-300 mb-2">Manage your friends and profile details here.</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mt-8 transition"
        >
          Go Home
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-12 overflow-y-auto">
        {/* User Profile Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Welcome back, Muddasar! 🎉</h2>
          <div className="w-32 h-32 rounded-full bg-gray-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            M
          </div>
          <p className="text-lg font-medium">You are doing great, keep it up!</p>
        </section>

        {/* Friends List Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">👯 Your Friends</h2>
          {loading ? (
            <p className="text-gray-400">Loading friends...</p>
          ) : friends.length === 0 ? (
            <p className="text-gray-400">You don't have any friends yet! 🤔</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {friends.map(friend => (
                <div
                  key={friend._id}
                  className="bg-[#2e2e3f] p-6 rounded-xl flex flex-col items-center text-center shadow-md hover:shadow-lg transition"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-2xl font-bold mb-4">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-blue-300 font-semibold">{friend.name}</p>
                  <p className="text-sm text-gray-300">{friend.email}</p>
                  <p className="text-sm text-gray-300">{friend.mobile}</p>
                  <button
                    onClick={() => alert(`Message sent to ${friend.name}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
                  >
                    Message
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
