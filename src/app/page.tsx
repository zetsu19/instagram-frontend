"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  House,
  Search,
  SquarePlus,
  CircleUser,
  MessageCircle,
  Heart,
  Send,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IG_LOGO } from "@/icons/image";
import { useUser } from "@/providers/AuthContext";
import { Button } from "@/components/ui/button";

export type User = {
  _id: string;
  username: string;
  followers: string[];
};

export type Post = {
  _id: string;
  images: string[];
  caption: string;
  like: string[];
  user: User;
};

const Page = () => {
  const { user, token } = useUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    if (!token) return;

    try {
      const response = await fetch("https://ig-backend-np0f.onrender.com/allPost", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const postLike = async (postId: string) => {
    try {
      const response = await fetch(
        `https://ig-backend-np0f.onrender.com/post/toggle-like/${postId}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchPosts();
      } else {
        console.log("Failed");
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const follow = async (followedUserid: string) => {
    try {
      const response = await fetch(
        `https://ig-backend-np0f.onrender.com/follow-toggle/${followedUserid}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Success");
        await fetchPosts();
      } else {
        toast.error("Failed");
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const deletePost = async (postIdd: string) => {
    const response = await fetch(
      `https://ig-backend-np0f.onrender.com/deletePostUser/${postIdd}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      await fetchPosts();
      console.log("succesfully deleted post");
    } else {
      console.log("failed to delete");
    }
  };

  const homePage = () => {
    push("/");
  };
  const searchPage = () => {
    push("/search");
  };
  const profilePage = () => {
    push("/profile");
  };
  const generatePostImage = () => {
    push("/Ai-photo-generate");
  };
  const commentPage = (postId: string) => {
    push(`/comment?postId=${postId}`);
  };
  const userProfile = (userId: string) => {
    push(`/user-profile/${userId}`);
  };
  const refresh = () => {
    window.location.reload();
  };
  useEffect(() => {
    if (!user) {
      push("/login");
      return;
    }
    fetchPosts();
  }, [user, token]);

  return (
    <div>
      <div className="border h-13 w-full fixed top-0 bg-white z-10">
        <div
          className="flex justify-center mt-3 cursor-pointer"
          onClick={refresh}
        >
          <IG_LOGO />
        </div>
      </div>
      <div className="max-w-xl mx-auto w-110 bg-white border border-gray-300 rounded-md shadow-md mt-16 mb-16">
        {posts.map((post) => (
          <div key={post._id} className="border-b border-gray-300 bg-white">
            <div className="flex px-4 py-3 items-center justify-between">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => userProfile(post.user._id)}
              >
                <img
                  className="h-9 w-9 rounded-full"
                  src="https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
                  alt="profile"
                />
                <span className="font-bold text-lg ml-2">
                  {post.user.username}
                </span>
              </div>

              {user && post.user._id !== user._id && (
                <button
                  className="h-8 px-3 text-sm border border-gray-300 rounded  "
                  onClick={() => follow(post.user._id)}
                >
                  {post.user.followers.includes(user._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
              {user && post.user._id === user._id && (
                <Button onClick={() => deletePost(post._id)}>Delete</Button>
              )}
            </div>
            <div className="w-full flex justify-center">
              <Carousel className="w-full max-w-md">
                <CarouselContent>
                  {post.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={img}
                        className="object-cover w-full max-h-[500px]"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="flex gap-4 mt-3 px-4">
              <div
                onClick={() => postLike(post._id)}
                className="cursor-pointer"
              >
                {post.like.includes(user?._id!) ? (
                  <Heart color="red" fill="red" />
                ) : (
                  <Heart />
                )}
              </div>
              <div
                className="cursor-pointer"
                onClick={() => commentPage(post._id)}
              >
                <MessageCircle />
              </div>
              <Send />
            </div>
            <div className="flex gap-1 ml-4 mt-1">
              <div className="font-black">{post.like.length}</div>
              <div>likes</div>
            </div>
            <div className="px-4 pb-4 mt-2">
              <span className="font-black mr-2">{post.user.username}</span>
              <span>{post.caption}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="border bg-white w-full fixed bottom-0 flex justify-between px-10 py-2">
        <House onClick={homePage} />
        <Search onClick={searchPage} />
        <SquarePlus onClick={generatePostImage} />
        <CircleUser onClick={profilePage} />
      </div>
    </div>
  );
};

export default Page;