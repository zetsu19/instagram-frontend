"use client";
import { useUser } from "@/providers/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { House } from "lucide-react";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { CircleUser } from "lucide-react";

export type User = {
  _id: string;
  username: string;
  followers: string[];
  following: string[];
  images: string;
};

export type Post = {
  _id: string;
  images: string;
  caption: string;
  like: string[];
  user: User;
};

const Page = () => {
  const { user, token, setUser, setToken } = useUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const fetchPosts = async () => {
    if (!token) return;
    const response = await fetch("https://ig-backend-np0f.onrender.com/userPost", {
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

  const fetchUser = async () => {
    const res = await fetch(`https://ig-backend-np0f.onrender.com/user-info/${user?._id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUserInfo(data);
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
    fetchPosts();
    fetchUser();
  }, [user, push, token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    push("/login");
  };
  const edit = () => {
    push("/edit")
  }
  const viewPost = (postId: string) => {
    push(`/userPostPicture/${postId}`);
  };
  return (
    <div>
      <div className="flex justify-center text-[20px]">{user?.username}</div>

      <div className="bg-[#fafafa] min-h-screen pb-16">
        <div className="flex px-4 py-6 border-b border-gray-300 bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <img
                className="h-12 w-12  "
                src={`https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=`}
              />
              <div className="text-2xl font-semibold">{userInfo?.username}</div>
              <button className="px-4 py-1 text-sm border border-gray-300 rounded"
              onClick={edit}>
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
                <div className="font-bold">{userInfo?.followers.length}</div>
                followers
              </span>
              <span>
                <div className="font-bold">{userInfo?.following.length}</div>
                following
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-2">
          {posts.map((post, index) => (
            <div key={index} className="aspect-square overflow-hidden">
              <div onClick={() => viewPost(post._id)}>
                <img
                  src={
                    Array.isArray(post.images) ? post.images[0] : post.images
                  }
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-2 z-50">
          <House onClick={homePage} className="w-6 h-6" />
          <Search className="w-6 h-6" onClick={search} />
          <SquarePlus onClick={generatePostImage} className="w-6 h-6" />
          <CircleUser onClick={Mainprofile} className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
export default Page;
