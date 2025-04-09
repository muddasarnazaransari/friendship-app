'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/pending-users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'decline') => {
    const res = await fetch(`/api/admin/${action}-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    });

    if (res.ok) {
      setUsers(users.filter((u: any) => u._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl mb-6 text-center">Welcome my king 👑</h1>
      {loading ? (
        <p className="text-center text-xl">Loading pending requests...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-xl">No pending friend requests 💤</p>
      ) : (
        <div className="space-y-4">
          {users.map((user: any) => (
            <div key={user._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Mobile:</strong> {user.mobile}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleAction(user._id, 'approve')}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(user._id, 'decline')}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
