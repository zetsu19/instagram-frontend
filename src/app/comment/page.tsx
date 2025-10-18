"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/AuthContext";
import { Send } from "lucide-react";
import { CircleArrowLeft } from "lucide-react";

const Page = () => {
  const { user, token } = useUser();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  const [post, setPost] = useState<any>("");
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const Comments = async () => {
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
      console.log(data);
      setComments(data);
    } else {
      console.error("Failed to fetch");
    }
  };

  const handleCreateComment = async () => {
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
      Comments();
    } else {
      console.error("Failed to post comment");
    }
  };

  const back = () => {
    push("/");
  };

  useEffect(() => {
    if (!user) push("/login");
    Comments();
  }, [postId, user, token]);

  return (
    <div className="max-w-xl mx-auto mt-4 bg-white border rounded-md  p-4">
      {post.map((postss, index) => {
        <div className="mb-4 border-b pb-3" key={index}>
          <div className="flex items-center gap-2">
            <CircleArrowLeft onClick={back} />
            <span className="font-bold">{postss.user.username}</span>
          </div>
          <span className="mt-2 text-gray-700">{postss.caption}</span>
          <img
            src={postss.images}
            className="w-full mt-2 rounded-md  object-cover"
          />
        </div>;
      })}
      {/* {post && (
        <div className="mb-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <CircleArrowLeft onClick={back} />
            <span className="font-bold">{post.user.username}</span>
          </div>
          <span className="mt-2 text-gray-700">{post.caption}</span>
          <img
            src={post.images}
            className="w-full mt-2 rounded-md  object-cover"
          />
        </div>
      )} */}
      <div className="space-y-3">
        {comments.map((commentss, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div className="flex">
              <div className="font-bold mr-2">{commentss.user.username}</div>
              <div>{commentss.comment}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4 border-t pt-3">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex w-full border rounded-md px-3 py-2 text-sm"
        />
        <button onClick={handleCreateComment} className="ml-2 p-2">
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Page;
