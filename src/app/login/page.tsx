"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser, decoded } from "@/providers/AuthContext";
import { jwtDecode } from "jwt-decode";
import { INSTAGRAM } from "@/icons/ig-logo";

const Page = () => {
  const { setUser, user, token, setToken } = useUser();
  const { push } = useRouter();

  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const login = async () => {
    const response = await fetch("https://ig-backend-np0f.onrender.com/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: info.email,
        password: info.password,
      }),
    });
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decoded = jwtDecode(token);
      setUser(decodedToken.data);
    } else {
      console.error("Login failed");
    }
  };

  const signup = () => {
    push("/signUp");
  };

  useEffect(() => {
    if (user) push("/");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-6">
        <div className="flex justify-center"><INSTAGRAM/></div>
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 italic">
          Instagram 
        </h2>
        <input
          type="email"
          name="email"
          value={info.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
        />

        <input
          type="password"
          name="password"
          value={info.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
        />

        <button
          onClick={login}
          className="w-full h-10 rounded-md bg-blue-400">
          Log In
        </button>

        <div className="flex justify-center">
          <div>Do not have an account?</div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={signup}
            className="w-20 h-10 rounded-md bg-blue-400"
          >
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
