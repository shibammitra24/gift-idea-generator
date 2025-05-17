"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { GiftIdea } from "@/types";
import Footer from "@/components/footer";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      {isMounted && (
        <PromptWindow
          setIsGenerating={setIsGenerating}
          setGiftIdeas={setGiftIdeas}
          setOccasion={setOccasion}
        />
      )}
      {isMounted && (
        <GiftSection
          isGenerating={isGenerating}
          giftIdeas={giftIdeas}
          occasion={occasion}
        />
      )}
      {/* <Footer /> */}
    </div>
  );
}
