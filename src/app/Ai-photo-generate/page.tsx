"use client";

import { useUser } from "@/providers/AuthContext";
import { upload } from "@vercel/blob/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { House, Search, SquarePlus, CircleUser } from "lucide-react";

const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();
  const { user, token } = useUser();

  useEffect(() => {
    if (!user) {
      push("/login");
    }
  }, [user, push]);

  const API_KEY = process.env.API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      };

      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry, bad quality, distorted",
              num_inference_steps: 100,
              guidance_scale: 7.5,
            },
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to generate");
      const blob = await response.blob();
      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImages((prev) => [...prev, uploaded.url]);
  };

  const createPosts = async () => {
    if (images.length === 0) return;
    try {
      const response = await fetch("https://zetsu-h2dp.onrender.com/createPost", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: prompt,
          images,
        }),
      });

      if (response.ok) {
        console.log("successfull");
        push("/")
      } else {
        console.log(" Failed ");
      }
    } catch (err) {
      console.error("ajilquen suga", err);
    }
  };

  const generatePostImage = () => push("/Ai-photo-generate");
  const homePage = () => push("/");
  const mainProfile = () => push("/profile");
  const search = () => push("/search");
  return (
    <div>
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg italic">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          AI Image Generator
        </h1>

        <label
          htmlFor="prompt"
          className="block text-sm font-semibold text-gray-700 mb-2 mt-8"
        >
          Describe your image:
        </label>

        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     transition resize-none"
          placeholder="Example: A futuristic city skyline at sunset in cyberpunk style..."
        />

        <button
          onClick={generateImage}
          disabled={!prompt}
          className={`mt-5 w-full py-3 px-4 rounded-lg font-semibold text-white text-lg shadow-md transition bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110`}
        >
          Generate Image
        </button>
        {images.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Generated ${index}`}
                  className="w-full h-auto rounded-lg shadow-xl border border-gray-200"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-5 gap-10">
        <button
          onClick={createPosts}
          disabled={images.length === 0}
          className="w-35 h-10 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 
                     text-white font-semibold shadow-md hover:brightness-110 transition 
                     focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 mb-20"
        >
          Create Post
        </button>
      </div>

      <div className="border bg-white w-screen fixed bottom-0 flex justify-between px-10 py-2">
        <House onClick={homePage} />
        <Search onClick={search} />
        <SquarePlus onClick={generatePostImage} />
        <CircleUser onClick={mainProfile} />
      </div>
    </div>
  );
};

export default Page;
