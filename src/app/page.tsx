"use client";

import { useState } from "react";
import GiftSection from "@/components/giftSection";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PromptWindow from "@/components/promptWindow";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [giftIdeas, setGiftIdeas] = useState([]);

  return (
    <>
      <Navbar />
      <Hero />
      <PromptWindow
        setIsGenerating={setIsGenerating}
        setGiftIdeas={setGiftIdeas}
      />
      <GiftSection isGenerating={isGenerating} giftIdeas={giftIdeas} />
    </>
  );
}
