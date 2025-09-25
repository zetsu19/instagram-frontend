"use client";

import { upload } from "@vercel/blob/client";
import { useState } from "react";

const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = process.env.API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImageUrl("");

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      };

      const response = await fetch(
        `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry, bad quality, distorted",
              num_inference: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      console.log(uploaded);
      setImageUrl(imageUrl);
    } catch (err) {
      setIsLoading(false);
    }
  };
  console.log(imageUrl);
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg italic">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        AI Image Generator
      </h1>

      <label
        htmlFor="prompt"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Describe your image:
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        disabled={isLoading}
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm 
               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
               disabled:opacity-50 disabled:cursor-not-allowed 
               transition resize-none"
        placeholder="Example: A futuristic city skyline at sunset in cyberpunk style..."
      />

      <button
        onClick={generateImage}
        disabled={!prompt.trim() || isLoading}
        className={`mt-5 w-full py-3 px-4 rounded-lg font-semibold text-white text-lg shadow-md transition 
      ${
        isLoading
          ? "bg-gradient-to-r  to-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r  via-purple-500"
      }
    `}
      >
        {isLoading ? " Generating..." : " Generate Image"}
      </button>

      {imageUrl && (
        <div className="mt-8">
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full h-auto rounded-lg shadow-xl border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
