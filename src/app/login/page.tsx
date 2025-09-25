"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/providers/AuthContext";
const Page = () => {
  const { setUser, user } = useUser();
  const { push } = useRouter();

  const login = async () => {
    const response = await fetch("http://localhost:10000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: "lord@gmail.com",
        password: "1234567890",
      }),
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      console.error("Login failed");
    }
  };

  useEffect(() => {
    if (user) push("/");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 italic">
          Instagram
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
        />
        <button
          onClick={login}
          className="w-full h-10 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white font-semibold shadow-md hover:brightness-110 transition focus:outline-none focus:ring-4 focus:ring-pink-300"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Page;
