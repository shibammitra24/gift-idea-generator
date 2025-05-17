"use client";

import { useState } from "react";
import GiftSection from "@/components/giftSection";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PromptWindow from "@/components/promptWindow";
import { GiftIdea } from "@/types";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [giftIdeas, setGiftIdeas] = useState<GiftIdea[]>([]);
  const [occasion, setOccasion] = useState("gift");

  return (
    <>
      <Navbar />
      <Hero />
      <PromptWindow
        setIsGenerating={setIsGenerating}
        setGiftIdeas={setGiftIdeas}
        setOccasion={setOccasion}
      />
      <GiftSection
        isGenerating={isGenerating}
        giftIdeas={giftIdeas}
        occasion={occasion}
      />
    </>
  );
}
