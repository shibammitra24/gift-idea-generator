"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { GiftIdea } from "@/types";
import Footer from "@/components/footer";
import Script from "next/script";

// Dynamically import components that use browser APIs
const GiftSection = dynamic(() => import("@/components/giftSection"), {
  ssr: false,
});

// Also dynamically import PromptWindow to avoid document reference issues
const PromptWindow = dynamic(() => import("@/components/promptWindow"), {
  ssr: false,
});

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [giftIdeas, setGiftIdeas] = useState<GiftIdea[]>([]);
  const [occasion, setOccasion] = useState("gift");
  const [isMounted, setIsMounted] = useState(false);

  // Only render client-side components after mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Load the fix-layout.js script */}
      <Script src="/fix-layout.js" strategy="afterInteractive" />

      <div className="w-full flex flex-col items-center">
        <Navbar />
        <div className="w-full max-w-6xl">
          <Hero />
        </div>
        {isMounted && (
          <div className="w-full flex justify-center">
            <PromptWindow
              setIsGenerating={setIsGenerating}
              setGiftIdeas={setGiftIdeas}
              setOccasion={setOccasion}
            />
          </div>
        )}
        {isMounted && (
          <div className="w-full flex justify-center">
            <GiftSection
              isGenerating={isGenerating}
              giftIdeas={giftIdeas}
              occasion={occasion}
            />
          </div>
        )}
      </div>
    </>
  );
}
