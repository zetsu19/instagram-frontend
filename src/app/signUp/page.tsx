"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { decoded, useUser } from "@/providers/AuthContext";
import { jwtDecode } from "jwt-decode";

const Page = () => {
  const { setUser, user, setToken } = useUser();
  const { push } = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const response = await fetch("https://zetsu-h2dp.onrender.com/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decoded = jwtDecode(token);
      setUser(decodedToken.data);
    } else {
      console.log("Signup failed");
    }
  };

  useEffect(() => {
    if (user) push("/");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-6">
        <div className="text-2xl font-semibold text-center mb-4 text-gray-800 italic">
          Instagram
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
        />

        <button
          onClick={signup}
          className="w-full h-10 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white font-semibold shadow-md hover:brightness-110 transition focus:outline-none focus:ring-4 focus:ring-pink-300"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Page;
