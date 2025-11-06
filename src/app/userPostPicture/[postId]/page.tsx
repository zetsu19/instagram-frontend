"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowLeft } from "lucide-react";
import {
  House,
  Search,
  SquarePlus,
  CircleUser,
  MessageCircle,
  Heart,
  Send,
} from "lucide-react";

const Page = () => {
  const { postId } = useParams();
  const { user, token } = useUser();
  const { push } = useRouter();
  const [post, setPost] = useState<any>(null);

  const fetchPost = async () => {
    try {
      const res = await fetch(`https://zetsu-h2dp.onrender.com/getPostById/${postId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        console.log("Failed to fetch post");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const postLike = async (postId: string) => {
    try {
      const response = await fetch(
        `https://zetsu-h2dp.onrender.com/post/toggle-like/${postId}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchPost();
      } else {
        console.log("Failed");
      }
    } catch (err) {
      console.error("Error", err);
    }
  };
  useEffect(() => {
    if (token && postId) fetchPost();
  }, [token, postId]);

  if (!post)
    return (
      <div className="flex justify-center items-center mt-200px">
        Loading...
      </div>
    );

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
  const commentPage = (postId: string) => {
    push(`/comment?postId=${postId}`);
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-300 flex items-center px-4 py-2">
        <ArrowLeft
          className="cursor-pointer mb-3 mr-2"
          onClick={() => push("/")}
        />
        <div className="flex items-center gap-4 mb-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
            alt="User avatar"
          />
          <div className="text-2xl font-semibold">{post.user.username}</div>
        </div>
      </div>

      <div className="mt-16 w-full max-w-md">
        <Carousel>
          <CarouselContent>
            {post.images.map((img: string, index: number) => (
              <CarouselItem key={index}>
                <img
                  src={img}
                  className="w-full object-contain max-h-[600px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex gap-4 mt-3 px-4">
        <div onClick={() => postLike(post._id)} className="cursor-pointer">
          {post.like.includes(user?._id!) ? (
            <Heart color="red" fill="red" />
          ) : (
            <Heart />
          )}
        </div>
        <div className="cursor-pointer" onClick={() => commentPage(post._id)}>
          <MessageCircle />
        </div>
        <Send />
      </div>
      <div className="flex gap-1 ml-4 mt-1">
        <div className="font-black">{post.like.length}</div>
        <div>likes</div>
      </div>
      <div className="p-4 w-full max-w-md">
        <p className="font-bold">{post.user.username}</p>
        <p>{post.caption}</p>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-2 z-50">
        <House onClick={homePage} className="w-6 h-6" />
        <Search className="w-6 h-6" onClick={search} />
        <SquarePlus onClick={generatePostImage} className="w-6 h-6" />
        <CircleUser onClick={Mainprofile} className="w-6 h-6" />
      </div>
    </div>
  );
}
export default Page;