"use client";
import { useUser } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { House } from "lucide-react";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { CircleUser } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const { user, token, setUser, setToken } = useUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    if (!token) return;
    const response = await fetch("http://localhost:10000/allPost", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setPosts(data);
    } else {
      console.log("Failed to fetch _");
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

  const follow = async (followedUserid: string) => {
    const response = await fetch(
      `http://localhost:10000/follow-toggle/${followedUserid}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );
    if (response.ok) {
      toast.success("success");
      console.log("succesfull");
      await fetchPosts();
    } else {
      console.log("amjiltgui");
    }
  };

  useEffect(() => {
    if (!user) {
      push("/login");
    }
    fetchPosts();
  }, [user, push, token]);

  const generatePostImage = () => {
    push("/Ai-photo-generate");
  };
  const homePage = () => {
    push("/");
  };
  const Mainprofile = () => {
    push("/profile");
  };

  const comment = (postId: string) => {
    push(`/comment?postId=${postId}`);
  };

  return (
    <div>
      <div className=" border h-15 w-full fixed font-black text-2xl bg-white ">
        <div className="flex justify-center mt-2">Instagram</div>
      </div>
      <div className="max-w-xl mx-auto bg-white border border-gray-300 rounded-md shadow-md ">
        <div className="flex items-center justify-between px-4 py-3 border-b"></div>
        <div className="mb-10 mt-13">
          {posts.map((post, index) => (
            <div key={index} className="border-b border-gray-300 bg-white">
              <div className="flex px-4 py-3 gap-10">
                <div className="flex items-center ">
                  <span className="font-bold text-xl">
                    {post.user.username}
                  </span>
                </div>
                <div>
                  {post.user.followers.includes(user!._id!) ? (
                    <button
                      className="  h-8 w-18 text-sm border border-gray-300 rounded"
                      onClick={() => follow(post.user._id)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="  h-8 w-16 text-sm border border-gray-300 rounded"
                      onClick={() => follow(post.user._id)}
                    >
                      Follow
                    </button>
                  )}
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
      </div>
      <div>
        <div className=" border bg-white w-screen fixed bottom-0 flex justify-between  px-10 py-2">
          <House onClick={homePage} />
          <Search />
          <SquarePlus onClick={generatePostImage} />
          <CircleUser onClick={Mainprofile} />
        </div>
      </div>
    </div>
  );
};

export default Home;
