"use client";
import { useUser } from "@/providers/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { House } from "lucide-react";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { CircleUser } from "lucide-react";

const Page = () => {
  const { user, token, setUser, setToken } = useUser();
  const { push } = useRouter();

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    if (!token) return;
    const response = await fetch("http://localhost:10000/userPost", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setPosts(data);
    } else {
      console.log("Failed to fetch ");
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

  useEffect(() => {
    fetchPosts();
  }, [user, push, token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    push("/login");
  };

  return (
    <div>
      <div className="flex justify-center text-[20px]">{user?.username}</div>

      <div className="bg-[#fafafa] min-h-screen pb-16">
        <div className="flex px-4 py-6 border-b border-gray-300 bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl font-semibold">{user?.username}</div>
              <button className="px-4 py-1 text-sm border border-gray-300 rounded">
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="h-8 w-16 text-sm border border-red-500 rounded "
              >
                logOut
              </button>
            </div>
            <div className="flex gap-6 text-sm">
              <span>
                <div className="font-bold">{posts.length}</div> posts
              </span>
              <span>
                <div className="font-bold">{user?.followers.length}</div>
                followers
              </span>
              <span>
                <div className="font-bold">{user?.following.length}</div>
                following
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-2">
          {posts.map((post, index) => (
            <div key={index} className="aspect-square overflow-hidden">
              <img src={post.images} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-2 z-50">
          <House onClick={homePage} className="w-6 h-6" />
          <Search className="w-6 h-6" />
          <SquarePlus onClick={generatePostImage} className="w-6 h-6" />
          <CircleUser onClick={Mainprofile} className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
export default Page;
