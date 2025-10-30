"use client";
import { useEffect, useState } from "react";
import { Search, SquarePlus, CircleUser, House } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, User } from "@/providers/AuthContext";

const Page = () => {
  const [inputValue, setInputValue] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { token, user } = useUser();
  const { push } = useRouter();

  const fetchAllUsers = async () => {
    if (!token) return;
      const res = await fetch("http://localhost:10000/all-users", {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllUsers(data);
      setFilteredUsers(data);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((u) =>
        u.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const toggleFollow = async (followedUserId: string) => {
    if (!token) return;
    try {
      await fetch(`http://localhost:10000/follow-toggle/${followedUserId}`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      fetchAllUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const generatePostImage = () => {
    push("/Ai-photo-generate");
  };
  const homePage = () => {
    push("/");
  };
  const Mainprofile = () => {
    push("/profile");
  };
  const search = () => {
    push("/search");
  };

  useEffect(() => {
    fetchAllUsers();
  }, [token]);

  return (
    <div className="pb-16">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <input
          placeholder="Search for someone"
          onChange={handleInput}
          value={inputValue}
          type="text"
          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
        />
      </div>

      <div className="p-4">
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No users found
          </div>
        )}

        {filteredUsers.map((u) => (
          <div
            key={u._id}
            className="flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => push(`/user-profile/${u._id}`)}
            >
              {u.profilePicture ? (
                <img
                  src={u.profilePicture}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {u.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900">{u.username}</div>
              </div>
            </div>

            {user && u._id !== user._id && (
              <button
                onClick={() => toggleFollow(u._id)}
                className={`${
                  u.followers.includes(user._id)
                    ? "border border-gray-300 text-gray-900 hover:bg-gray-100"
                    : "bg-[#0095F6] text-white hover:bg-[#1877F2]"
                } font-semibold px-4 py-1.5 rounded-md text-sm transition-all duration-200 active:scale-95`}
              >
                {u.followers.includes(user._id) ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border bg-white w-full fixed bottom-0 flex justify-between px-10 py-2">
        <House onClick={homePage} className="cursor-pointer" />
        <Search onClick={search} className="cursor-pointer" />
        <SquarePlus onClick={generatePostImage} className="cursor-pointer" />
        <CircleUser onClick={Mainprofile} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Page;
