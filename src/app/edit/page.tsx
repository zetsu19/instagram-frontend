"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthContext";

const Page = () => {
  const { user, token } = useUser();
  const { push } = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchUserInfo = async () => {
      const res = await fetch(`https://zetsu-h2dp.onrender.com/user-info/${user._id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
      }
    };
    fetchUserInfo();
  }, [user, token]);

  const handleSave = async () => {
    const res = await fetch(`https://zetsu-h2dp.onrender.com/editProfile/${user?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      push("/profile");
    } else {
      console.log("Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <label className="block mb-2 font-semibold">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Save
        </button>
        <button
          onClick={() => push("/profile")}
          className="w-full mt-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Page;
