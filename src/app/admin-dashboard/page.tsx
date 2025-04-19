'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
}

type Tab = 'requests' | 'blocked' | 'messages';

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [selectedTab, setSelectedTab] = useState<Tab>('requests');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/pending-users');
        if (!res.ok) throw new Error("Error fetching users");

        const data = await res.json();
        setPendingUsers(data.pendingUsers);
        setApprovedUsers(data.approvedUsers);
        setBlockedUsers(data.blockedUsers);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'decline') => {
    try {
      const res = await fetch(`/api/admin/${action}-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id }),
      });

      if (!res.ok) throw new Error(`Failed to ${action} user`);

      setPendingUsers(prev => prev.filter(user => user._id !== id));
      if (action === 'approve') {
        const approvedUser = pendingUsers.find(user => user._id === id);
        if (approvedUser) setApprovedUsers(prev => [...prev, approvedUser]);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} user`);
    }
  };

  const handleBlock = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/block-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id }),
      });

      if (!res.ok) throw new Error("Failed to block user");

      const blockedUser = approvedUsers.find(user => user._id === id);
      setApprovedUsers(prev => prev.filter(user => user._id !== id));
      if (blockedUser) setBlockedUsers(prev => [...prev, blockedUser]);
    } catch (err) {
      console.error(err);
      alert("Error blocking user");
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/unblock-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id }),
      });

      if (!res.ok) throw new Error("Failed to unblock user");

      const unblockedUser = blockedUsers.find(user => user._id === id);
      setBlockedUsers(prev => prev.filter(user => user._id !== id));
      if (unblockedUser) setApprovedUsers(prev => [...prev, unblockedUser]);
    } catch (err) {
      console.error(err);
      alert("Error unblocking user");
    }
  };

  const handleEmailSend = async () => {
    if (!message.trim() || selectedEmails.length === 0) {
      alert("Message or recipients missing");
      return;
    }

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients: selectedEmails, message }),
      });

      if (!res.ok) throw new Error("Email send failed");

      alert("Email sent successfully!");
      setMessage('');
      setSelectedEmails([]);
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout error");
    }
  };

  const renderRequests = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6">📨 Pending Requests</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : pendingUsers.length === 0 ? (
        <p className="text-gray-400">No pending requests 💨</p>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map(user => (
            <div key={user._id} className="bg-[#2e2e3f] p-5 rounded-xl flex items-center justify-between">
              <div>
                <p><span className="text-blue-400 font-medium">Name:</span> {user.name}</p>
                <p><span className="text-blue-400 font-medium">Email:</span> {user.email}</p>
                <p><span className="text-blue-400 font-medium">Mobile:</span> {user.mobile}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleAction(user._id, 'approve')} className="bg-green-500 px-4 py-2 rounded-md">Approve</button>
                <button onClick={() => handleAction(user._id, 'decline')} className="bg-red-500 px-4 py-2 rounded-md">Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-12 mb-6">✅ Approved Friends</h2>
      {approvedUsers.length === 0 ? (
        <p className="text-gray-400">No approved users yet 🧍</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {approvedUsers.map(user => (
            <div key={user._id} className="bg-[#2e2e3f] p-6 rounded-xl text-center">
              <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-blue-300 font-semibold">{user.name}</p>
              <p className="text-sm text-gray-300">{user.email}</p>
              <p className="text-sm text-gray-300">{user.mobile}</p>
              <button onClick={() => handleBlock(user._id)} className="mt-4 bg-yellow-500 px-4 py-2 rounded-md text-sm">Block</button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderBlocked = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6">🚫 Blocked Users</h2>
      {blockedUsers.length === 0 ? (
        <p className="text-gray-400">No blocked users yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blockedUsers.map(user => (
            <div key={user._id} className="bg-[#2e2e3f] p-6 rounded-xl text-center">
              <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-blue-300 font-semibold">{user.name}</p>
              <p className="text-sm text-gray-300">{user.email}</p>
              <p className="text-sm text-gray-300">{user.mobile}</p>
              <button
                onClick={() => handleUnblock(user._id)}
                className="mt-4 bg-green-500 px-4 py-2 rounded-md text-sm"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderMessages = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6">✉️ Send Message</h2>
      <textarea
        className="w-full h-40 p-4 bg-[#2e2e3f] rounded-lg text-white mb-4"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <h3 className="text-lg mb-2">Select recipients:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {approvedUsers.map(user => (
          <label key={user._id} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-blue-500"
              checked={selectedEmails.includes(user.email)}
              onChange={() => {
                setSelectedEmails(prev =>
                  prev.includes(user.email)
                    ? prev.filter(email => email !== user.email)
                    : [...prev, user.email]
                );
              }}
            />
            <span>{user.name} ({user.email})</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleEmailSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        Send Email
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#1e1e2f] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2e2e3f] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-8">Admin 👑</h1>
          <nav className="space-y-3">
            <button onClick={() => setSelectedTab('requests')} className={`block w-full text-left px-3 py-2 rounded-lg ${selectedTab === 'requests' ? 'bg-blue-500' : 'hover:bg-blue-600'}`}>Requests</button>
            <button onClick={() => setSelectedTab('blocked')} className={`block w-full text-left px-3 py-2 rounded-lg ${selectedTab === 'blocked' ? 'bg-blue-500' : 'hover:bg-blue-600'}`}>Blocked Users</button>
            <button onClick={() => setSelectedTab('messages')} className={`block w-full text-left px-3 py-2 rounded-lg ${selectedTab === 'messages' ? 'bg-blue-500' : 'hover:bg-blue-600'}`}>Messages</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mt-8 transition">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-12 overflow-y-auto">
        {selectedTab === 'requests' && renderRequests()}
        {selectedTab === 'blocked' && renderBlocked()}
        {selectedTab === 'messages' && renderMessages()}
      </main>
    </div>
  );
}
