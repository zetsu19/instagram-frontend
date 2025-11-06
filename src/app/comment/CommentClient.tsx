"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/AuthContext";
import {
  Send,
  CircleArrowLeft,
  Search,
  SquarePlus,
  CircleUser,
  House,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CommentType = {
  _id: string;
  comment: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
};

type PostType = {
  _id: string;
  caption: string;
  images: string[];
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
};

export default function CommentClient() {
  const { user, token } = useUser();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchPost = async () => {
    if (!token || !postId) return;
    try {
      const res = await fetch(
        `https://zetsu-h2dp.onrender.com/get-single-post/${postId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        toast.error("Failed to load post");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    if (!token || !postId) return;
    try {
      const res = await fetch(
        `https://zetsu-h2dp.onrender.com/get-all-comment/${postId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateComment = async () => {
    if (!token || !postId) return;
    try {
      const res = await fetch("https://zetsu-h2dp.onrender.com/create-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, comment: newComment }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else toast.error("Failed to post comment");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) {
      push("/login");
      return;
    }
    fetchPost();
    fetchComments();
  }, [user, token, postId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b h-13 w-full fixed flex bg-white z-50 px-5 py-3 items-center gap-4">
        <CircleArrowLeft onClick={() => push("/")} className="cursor-pointer" />
        <div className="font-black text-xl">Comments</div>
      </div>

      <div className="max-w-xl mx-auto pt-20 bg-white border rounded-md p-4 mb-20">
        {post ? (
          <>
            <div className="mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <img
                  src="https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-bold">{post.user.username}</span>
              </div>
              <div className="mt-2 text-gray-700">{post.caption}</div>
              {post.images?.length > 0 && (
                <Carousel className="mt-3 w-full max-w-md">
                  <CarouselContent>
                    {post.images.map((img, i) => (
                      <CarouselItem key={i}>
                        <img
                          src={img}
                          alt="post"
                          className="w-full rounded-md object-cover max-h-[400px]"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                </Carousel>
              )}
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="text-gray-500 text-center py-3">
                  No comments yet
                </div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-start gap-3 bg-gray-50 rounded-md p-2"
                  >
                    <img
                      src="https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
                      alt="profile"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-sm">{c.user.username}</div>
                      <div className="text-gray-800 text-sm">{c.comment}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center mt-4 border-t pt-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex w-full border rounded-md px-3 py-2 text-sm"
              />
              <button
                onClick={handleCreateComment}
                className="ml-2 p-2 text-gray-600 hover:text-black"
              >
                <Send />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">Post not found</div>
        )}
      </div>

      <div className="border-t bg-white w-screen fixed bottom-0 flex justify-between px-10 py-2">
        <House onClick={() => push("/")} className="cursor-pointer" />
        <Search onClick={() => push("/search")} className="cursor-pointer" />
        <SquarePlus
          onClick={() => push("/Ai-photo-generate")}
          className="cursor-pointer"
        />
        <CircleUser
          onClick={() => push("/profile")}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
