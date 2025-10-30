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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CommentType = {
  _id: string;
  comment: string;
  user: {
    _id: string;
    username: string;
  };
};

type PostType = {
  _id: string;
  caption: string;
  images: string[];
  user: {
    _id: string;
    username: string;
  };
};

const CommentPage = () => {
  const { user, token } = useUser();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    if (!token || !postId) return;
    try {
      const response = await fetch(
        `http://localhost:10000/get-all-comment/${postId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setPost(data[0].post);
        }
        setComments(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      toast.warning("Please write a comment before sending!");
      return;
    }

    if (!token || !postId) return;

    try {
      const response = await fetch("http://localhost:10000/create-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          comment: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        await fetchComments();
      } else {
        toast.error("Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const back = () => push("/");
  const generatePostImage = () => push("/Ai-photo-generate");
  const homePage = () => push("/");
  const mainProfile = () => push("/profile");
  const search = () => push("/search");

  useEffect(() => {
    if (!user) {
      push("/login");
      return;
    }
    fetchComments();
  }, [user, token, postId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="border-b h-13 w-full fixed flex bg-white z-50 px-5 py-3 items-center gap-4">
        <CircleArrowLeft onClick={back} className="cursor-pointer" />
        <div className="font-black text-xl">Comments</div>
      </div>


      <div className="max-w-xl mx-auto pt-20 bg-white border rounded-md p-4">
        {post ? (
          <>
            <div className="mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold">{post.user.username}</span>
              </div>
              <div className="mt-2 text-gray-700">{post.caption}</div>

              {post.images && post.images.length > 0 && (
                <Carousel className="mt-3 w-full max-w-md">
                  <CarouselContent>
                    {post.images.map((img, idx) => (
                      <CarouselItem key={idx}>
                        <img
                          src={img}
                          alt="post image"
                          className="w-full rounded-md object-cover max-h-[400px]"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="text-gray-500 text-center py-3">
                  No comments yet. Be the first!
                </div>
              ) : (
                comments.map((c, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-gray-50 rounded-md p-2"
                  >
                    <div className="font-bold">{c.user.username}</div>
                    <div className="text-gray-800">{c.comment}</div>
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
          <div className="text-center text-gray-500">Post not found.</div>
        )}
      </div>

      <div className="border-t bg-white w-screen fixed bottom-0 flex justify-between px-10 py-2">
        <House onClick={homePage} className="cursor-pointer" />
        <Search onClick={search} className="cursor-pointer" />
        <SquarePlus onClick={generatePostImage} className="cursor-pointer" />
        <CircleUser onClick={mainProfile} className="cursor-pointer" />
      </div>
    </div>
  );
};



export default CommentPage;
