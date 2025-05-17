"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, Sparkles } from "lucide-react";
import clsx from "clsx";
import { OCCASIONS, INTERESTS } from "@/data/promptData";

interface PromptWindowProps {
  setIsGenerating: (isGenerating: boolean) => void;
  setGiftIdeas: (ideas: any[]) => void;
}

export default function PromptWindow({
  setIsGenerating,
  setGiftIdeas,
}: PromptWindowProps) {
  const [occasion, setOccasion] = useState("Birthday");
  const [interests, setInterests] = useState<string[]>(["Sports", "Cooking"]);
  const [inputInterest, setInputInterest] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // New states for gift generation
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Filter INTERESTS based on input and not already selected
  const filteredSuggestions = INTERESTS.filter(
    (interest) =>
      interest.toLowerCase().includes(inputInterest.toLowerCase()) &&
      !interests.includes(interest)
  );

  // Reset highlighted index when input or suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [inputInterest, filteredSuggestions.length]);

  const addInterest = (interest: string) => {
    // Only add if it's in the predefined INTERESTS list
    if (
      interest &&
      INTERESTS.includes(interest) &&
      !interests.includes(interest)
    ) {
      setInterests([...interests, interest]);
    }
    setInputInterest("");
    setShowSuggestions(false);
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  // Handle surprise me button click
  const handleSurpriseMe = () => {
    // Pick a random occasion
    const randomOccasion =
      OCCASIONS[Math.floor(Math.random() * OCCASIONS.length)];

    // Create a copy of INTERESTS to avoid modifying the original
    const availableInterests = [...INTERESTS];
    const randomInterests: string[] = [];

    // Pick 2-3 random interests
    const numInterests = Math.floor(Math.random() * 2) + 2; // Random number between 2-3

    for (let i = 0; i < numInterests && availableInterests.length > 0; i++) {
      // Get random index
      const randomIndex = Math.floor(Math.random() * availableInterests.length);
      // Add interest to selected list
      randomInterests.push(availableInterests[randomIndex]);
      // Remove from available list to avoid duplicates
      availableInterests.splice(randomIndex, 1);
    }

    // Update state
    setOccasion(randomOccasion);
    setInterests(randomInterests);
  };

  // Show suggestions whenever input is focused
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setShowSuggestions(true);
    }
  }, [inputInterest]);

  // Function to generate gift ideas
  const generateGiftIdeas = async () => {
    if (interests.length === 0) {
      setError("Please add at least one interest");
      return;
    }

    setError("");
    setIsGenerating(true); // Update parent state

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          occasion,
          interests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate gift ideas");
      }

      setGiftIdeas(data.giftIdeas); // Update parent state
    } catch (err: any) {
      console.error("Error generating gift ideas:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsGenerating(false); // Update parent state
    }
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto mt-8 rounded-xl border border-[#FF8200]/10 bg-[#191816] p-6 sm:p-12 flex flex-col gap-8"
      style={{
        boxShadow:
          "0 0 80px 0 rgba(255,130,0,0.18), 0 0 0 1px rgba(255,130,0,0.08), 0 0 120px 0 rgba(255,130,0,0.10)",
      }}
    >
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Occasion */}
        <div className="flex-1 flex flex-col items-center">
          <label
            className="text-white text-xl mb-4 font-sans"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Occasion
          </label>
          <Select value={occasion} onValueChange={setOccasion}>
            <SelectTrigger className="w-full max-w-md bg-[#191816] border border-[#333] text-lg text-white rounded-xl h-14 focus:ring-0 focus:border-[#FF8200] p-6">
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent className="bg-[#191816] border-[#333] text-white">
              {OCCASIONS.map((o) => (
                <SelectItem
                  key={o}
                  value={o}
                  className="data-[state=checked]:bg-[#FF8200] data-[state=checked]:text-black px-6 py-3 transition-colors"
                >
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Interests */}
        <div className="flex-1 flex flex-col items-center relative">
          <label
            className="text-white text-xl mb-4 font-sans"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Interests
          </label>
          <div className="w-full max-w-md min-h-[96px] bg-[#191816] border border-[#333] rounded-xl flex flex-wrap items-start gap-2 p-4 relative">
            {interests.map((interest) => (
              <span
                key={interest}
                className="flex items-center bg-[#FF8200]/10 border border-[#FF8200]/30 text-white px-4 py-2 rounded-full text-base font-medium gap-2"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-1 focus:outline-none"
                  aria-label={`Remove ${interest}`}
                >
                  <X size={18} className="text-[#FF8200]" />
                </button>
              </span>
            ))}
            <div className="relative">
              <Input
                ref={inputRef}
                className="bg-transparent border-none outline-none text-white w-24 cursor-pointer"
                placeholder="Add"
                value={inputInterest}
                onChange={(e) => {
                  setInputInterest(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => {
                  switch (e.key) {
                    case "ArrowDown":
                      e.preventDefault();
                      setHighlightedIndex((prevIndex) =>
                        prevIndex < filteredSuggestions.length - 1
                          ? prevIndex + 1
                          : 0
                      );
                      break;
                    case "ArrowUp":
                      e.preventDefault();
                      setHighlightedIndex((prevIndex) =>
                        prevIndex > 0
                          ? prevIndex - 1
                          : filteredSuggestions.length - 1
                      );
                      break;
                    case "Enter":
                      e.preventDefault();
                      if (
                        highlightedIndex >= 0 &&
                        highlightedIndex < filteredSuggestions.length
                      ) {
                        addInterest(filteredSuggestions[highlightedIndex]);
                      } else if (filteredSuggestions.length > 0) {
                        addInterest(filteredSuggestions[0]);
                      }
                      break;
                  }
                }}
              />
              {(showSuggestions ||
                inputRef.current === document.activeElement) &&
                filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 top-10 z-10 bg-[#191816] border border-[#333] rounded-lg shadow-lg w-40">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={suggestion}
                          className={`px-4 py-2 cursor-pointer transition-colors ${
                            index === highlightedIndex
                              ? "bg-[#FF8200] text-black"
                              : "hover:bg-[#FF8200] hover:text-black"
                          }`}
                          onMouseDown={() => addInterest(suggestion)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          {suggestion}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">No options</div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
        <Button
          className="bg-[#FF8200] hover:bg-orange-600 text-black font-semibold px-8 py-3 rounded-full text-lg"
          onClick={generateGiftIdeas}
          disabled={interests.length === 0}
        >
          Generate Ideas
        </Button>
        <Button
          variant="outline"
          className={clsx(
            "border-none bg-[#191816] text-white px-8 py-3 rounded-full text-lg flex items-center gap-2",
            "hover:bg-[#2a1a07]"
          )}
          onClick={handleSurpriseMe}
          disabled={false}
        >
          Surprise me <Sparkles className="ml-2 w-5 h-5 text-[#FF8200]" />
        </Button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
}
