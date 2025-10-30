"use client";
import { useUser } from "@/providers/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { Send } from "lucide-react";
import { House } from "lucide-react";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { CircleUser } from "lucide-react";
import { CircleArrowLeft } from "lucide-react";

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
  const postLike = async (postId: string) => {
    const response = await fetch(
      `http://localhost:10000/post/toggle-like/${postId}`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }
    );
    if (response.ok) {
      console.log("success");
      fetchPosts();
    } else {
      console.log("TwT");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user, push, token]);

  const comment = (postId: string) => {
    push(`/comment?postId=${postId}`);
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
  const profileMain = () => {
    push("/profile");
  };
  return (
    <div>
      <div className=" border h-15 w-full fixed font-black text-2xl bg-white ">
        <div className="flex">
          <CircleArrowLeft className="mt-4 ml-5" onClick={profileMain} />
          <div className="flex mt-3 ml-5 italic">Posts</div>
        </div>
      </div>
      <div className="pt-14 pb-10">
        {posts.map((post, index) => (
          <div key={index} className="border-b border-gray-300 bg-white ">
            <div className="flex px-4 py-3 gap-5">
              <div className="flex items-center ">
                <img
                  className="h-9 w-9  rounded-full "
                  src={`https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=`}
                />
                <span className="font-bold text-xl ml-2">
                  {post.user.username}
                </span>
              </div>

            </div>
            <img
              src={post.images}
              className="w-full object-cover max-h-[500px]"
            />
            <div className="flex gap-4 mt-1">
              <div
                className="flex ml-4 mt-1 "
                onClick={() => postLike(post._id)}
              >
                {post.like.includes(user._id) ? (
                  <Heart color="red" fill="red" />
                ) : (
                  <Heart />
                )}
              </div>
              <div className="mt-1" onClick={() => comment(post._id)}>
                <MessageCircle />
              </div>
              <Send className="mt-1" />
            </div>
            <div className="flex gap-1 ml-4 mt-1">
              <div className="font-black ">{post.like.length} </div>
              <div>likes</div>
            </div>
            <div className="px-4 pb-4 mt-2">
              <span className="font-black mr-2">{post.user.username}</span>
              <span>{post.caption}</span>
            </div>
          </div>
        ))}
      </div>
      <div className=" border bg-white w-screen fixed bottom-0 flex justify-between  px-10 py-2">
        <House onClick={homePage} />
        <Search onClick={search} />
        <SquarePlus onClick={generatePostImage} />
        <CircleUser onClick={Mainprofile} />
      </div>
    </div>
  );
};
export default Page;
