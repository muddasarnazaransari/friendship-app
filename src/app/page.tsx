// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-login on reload
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") router.push("/admin-dashboard");
    else if (role === "user") router.push("/dashboard");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("role", data.role);
      router.push(data.role === "admin" ? "/admin-dashboard" : "/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white bg-opacity-95 rounded-3xl shadow-2xl p-10 backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-2">🚀 Welcome Back</h2>
        <p className="text-center text-sm font-medium text-gray-600 mb-6">
          Login to vibe with your friends ✨
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 font-medium"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 font-medium"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && (
          <p className="text-red-600 text-center font-semibold mb-2">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition-all duration-300 shadow-md"
        >
          {loading ? "Logging in..." : "Let’s Go 🔥"}
        </button>
      </form>

      {/* "Become My Friend" Link */}
      <p className="mt-6 text-white text-sm text-center">
        New here?{" "}
        <span
          className="underline font-semibold cursor-pointer text-white hover:text-yellow-200"
          onClick={() => router.push("/register")}
        >
          Become My Friend 💌
        </span>
      </p>
    </div>
  );
}
