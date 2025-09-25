"use client";
import { useUser } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { user } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (!user) {
      push("/login");
    }
  }, [user, push]);

  return (
    <div>
      <div>Home Page</div>
      <div>{user?.username}</div>
    </div>
  );
};

export default Home;
