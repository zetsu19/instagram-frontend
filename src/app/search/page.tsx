"use client";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { CircleUser } from "lucide-react";
import { House } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();
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
  return (
    <div>
      <div>search</div>
      <img className="h-10 w-10" src={`https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=`}/>
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
