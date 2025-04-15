'use client';

import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
}

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/pending-users');
      
      if (!res.ok) {
        console.error("Error fetching users:", res.statusText);
        return;
      }

      const { pendingUsers, approvedUsers } = await res.json();

      setPendingUsers(pendingUsers);
      setApprovedUsers(approvedUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'decline') => {
    const res = await fetch(`/api/admin/${action}-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    });

    if (res.ok) {
      setPendingUsers(prev => prev.filter(user => user._id !== id));
      if (action === 'approve') {
        const approvedUser = pendingUsers.find(user => user._id === id);
        if (approvedUser) {
          setApprovedUsers(prev => [...prev, approvedUser]);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-blue-900 text-white p-8 space-y-10 font-poppins">
      <h1 className="text-5xl text-center font-bold mb-6">Admin Dashboard 👑</h1>

      {/* Pending Requests */}
      <section>
        <h2 className="text-3xl mb-6 text-pink-400">Pending Friend Requests 💌</h2>
        {loading ? (
          <p className="text-xl text-gray-300">Loading pending requests...</p>
        ) : pendingUsers.length === 0 ? (
          <p className="text-xl text-gray-400">No pending requests 💤</p>
        ) : (
          <div className="space-y-6">
            {pendingUsers.map(user => (
              <div
                key={user._id}
                className="bg-gray-800 p-6 rounded-xl flex justify-between items-center hover:bg-gray-700 transition duration-300 ease-in-out shadow-lg"
              >
                <div>
                  <p><strong className="text-teal-400">Name:</strong> {user.name}</p>
                  <p><strong className="text-teal-400">Email:</strong> {user.email}</p>
                  <p><strong className="text-teal-400">Mobile:</strong> {user.mobile}</p>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => handleAction(user._id, 'approve')}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-semibold text-lg transition duration-300 ease-in-out"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(user._id, 'decline')}
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-semibold text-lg transition duration-300 ease-in-out"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved Friends */}
      <section>
        <h2 className="text-3xl mb-6 text-yellow-400">Already Friends 👯</h2>
        {approvedUsers.length === 0 ? (
          <p className="text-xl text-gray-400">No friends yet 👀</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedUsers.map(user => (
              <div
                key={user._id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-2xl text-white">
                    {/* Placeholder for user profile picture */}
                    <span>{user.name.charAt(0)}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg text-teal-400"><strong>Name:</strong> {user.name}</p>
                    <p className="text-sm text-teal-300"><strong>Email:</strong> {user.email}</p>
                    <p className="text-sm text-teal-300"><strong>Mobile:</strong> {user.mobile}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
