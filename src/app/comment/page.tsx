"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/AuthContext";
import { Send } from "lucide-react";
import { CircleArrowLeft } from "lucide-react";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { CircleUser } from "lucide-react";
import { House } from "lucide-react";

const Page = () => {
  const { user, token } = useUser();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  const [post, setPost] = useState<any>();
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
    if (!user) push("/login");
    Comments();
  }, [postId, user, token]);

  return (
    <div>
      <div className=" border h-13 w-full fixed flex bg-white ">
        <CircleArrowLeft onClick={back} className="mt-3 ml-5"/>
              <div className="flex justify-center font-black text-2xl  mt-2 ml-5 ">Comments</div>
            </div>
      <div className="max-w-xl mx-auto pt-15 bg-white border rounded-md  p-4">
        <div className="mb-4 border-b pb-3">
          <div className="flex items-center gap-2">
            
            <span className="font-bold">{post?.user.username}</span>
          </div>
          <div className="mt-2 text-gray-700">{post?.caption}</div>
          <img
            src={post?.images}
            className="w-full mt-2 rounded-md  "
          />
        </div>
        <div>
          <div className="space-y-3">
            {comments.map((commentss, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex">
                  <div className="font-bold mr-2">
                    {commentss.user.username}
                  </div>
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
