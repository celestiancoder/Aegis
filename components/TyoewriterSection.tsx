"use client";

import { TypewriterEffect } from "./ui/typewriter-effect";
import Link from "next/link";

export function TypewriterSection() {
  const words = [
    {
      text: "Combat",
      className: "text-purple-100 text-3xl"
    },
    {
      text: "discrimination",
      className: "text-purple-100 text-3xl"
    },
    {
      text: "with",
      className: "text-purple-100 text-3xl"
    },
    {
      text: "AI-powered",
      className: "text-purple-100 text-3xl"
    },
    {
      text: "training.",
      className: "text-purple-100 text-3xl",
    },
  ];

  return (
    <div className="space-y-2">
      <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
        EQUALITY CHAMPIONS
      </h1>
      
      <div className="flex flex-col items-start justify-start">
        <p className="text-blue-200 text-base mb-4">
          The path to equality starts here
        </p>
        <TypewriterEffect words={words} />
        <div className="flex gap-4 mt-6">
          <Link 
            href="/practice" 
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition duration-300 shadow-lg"
          >
            Practice with AI
          </Link>
          <Link 
            href="/chat" 
            className="px-6 py-3 rounded-full border-2 border-blue-300 text-blue-200 font-medium hover:bg-blue-900/30 hover:scale-105 transition duration-300"
          >
            Connect Globally
          </Link>
        </div>
      </div>
    </div>
  );
}