"use client";
import { useUser } from "../../../providers/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { House, Search, SquarePlus, CircleUser, CircleArrowLeft } from "lucide-react";

export type User = {
  _id: string;
  username: string;
  followers: string[];
  following: string[];
};

export type Post = {
  _id: string;
  images: string[];
  caption: string;
  like: string[];
  user: string;
};

const ClickedUserPage = () => {
  const { token } = useUser();
  const { push } = useRouter();
  const params = useParams();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const fetchUser = async () => {
    const res = await fetch(
      `http://localhost:10000/user-info/${params.userId}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setUserInfo(data);
  };

  const fetchPosts = async () => {
    const res = await fetch(
      `http://localhost:10000/clicked-user-post/${params.userId}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setUserPosts(data);
  };

  useEffect(() => {
    if (token) fetchUser();
    if (token) fetchPosts();
  }, [token, params.userId]);

  const goHome = () => {
    push("/");
  };
  const search = () => {
    push("/search");
  };
  const generate = () => {
    push("/Ai-photo-generate");
  };
  const myProfile = () => {
    push("/profile");
  };
  const profileMain = () => {
    push("/");
  };
  return (
    <div>
      <div className="flex">
      <CircleArrowLeft className="mt-4 ml-5" onClick={profileMain} />
      <div className="flex justify-center text-[20px] font-semibold mt-3 ml-2">
        Back
      </div>
      </div>
      <div className="bg-[#fafafa] min-h-screen pb-16">
        <div className="flex px-4 py-6 border-b border-gray-300 bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
                alt="User avatar"
              />
              <div className="text-2xl font-semibold">{userInfo?.username}</div>
            </div>

            <div className="flex gap-6 text-sm">
              <span>
                <div className="font-bold">{userPosts.length}</div> posts
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
          {userPosts.map((post) => (
            <div key={post._id} className="aspect-square overflow-hidden">
              <img
                src={post.images[0]}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-2 z-50">
          <House onClick={goHome} className="w-6 h-6" />
          <Search onClick={search} className="w-6 h-6" />
          <SquarePlus onClick={generate} className="w-6 h-6" />
          <CircleUser onClick={myProfile} className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default ClickedUserPage;
