'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1e1e2f] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2e2e3f] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-8">Admin 👑</h1>
          <div>
            <p className="text-gray-300 mb-2">Manage users, approve requests, and stay in control.</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mt-8 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-12 overflow-y-auto">
        {/* Pending Requests */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">📨 Pending Requests</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : pendingUsers.length === 0 ? (
            <p className="text-gray-400">No pending requests 💨</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map(user => (
                <div
                  key={user._id}
                  className="bg-[#2e2e3f] p-5 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition"
                >
                  <div>
                    <p><span className="text-blue-400 font-medium">Name:</span> {user.name}</p>
                    <p><span className="text-blue-400 font-medium">Email:</span> {user.email}</p>
                    <p><span className="text-blue-400 font-medium">Mobile:</span> {user.mobile}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAction(user._id, 'approve')}
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(user._id, 'decline')}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved Users */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">✅ Approved Friends</h2>
          {approvedUsers.length === 0 ? (
            <p className="text-gray-400">No approved users yet 🧍</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {approvedUsers.map(user => (
                <div
                  key={user._id}
                  className="bg-[#2e2e3f] p-6 rounded-xl flex flex-col items-center text-center shadow-md hover:shadow-lg transition"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-2xl font-bold mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-blue-300 font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-300">{user.email}</p>
                  <p className="text-sm text-gray-300">{user.mobile}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
