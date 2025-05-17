"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Search, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { OCCASIONS, INTERESTS } from "@/data/promptData";

// Update the interface to include setOccasion
interface PromptWindowProps {
  setIsGenerating: (isGenerating: boolean) => void;
  setGiftIdeas: (ideas: any[]) => void;
  setOccasion: (occasion: string) => void;
}

export default function PromptWindow({
  setIsGenerating,
  setGiftIdeas,
  setOccasion,
}: PromptWindowProps) {
  const [occasion, setOccasionState] = useState("Birthday");
  const [interests, setInterests] = useState<string[]>(["Sports", "Cooking"]);
  const [inputInterest, setInputInterest] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [occasionSearch, setOccasionSearch] = useState("");
  const [showCustomOccasionSelector, setShowCustomOccasionSelector] =
    useState(false);
  const [highlightedOccasionIndex, setHighlightedOccasionIndex] = useState(-1);

  // New states for gift generation
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const occasionSearchRef = useRef<HTMLInputElement>(null);
  const occasionListRef = useRef<HTMLDivElement>(null);

  // Filter INTERESTS based on input and not already selected
  const filteredSuggestions = INTERESTS.filter(
    (interest) =>
      interest.toLowerCase().includes(inputInterest.toLowerCase()) &&
      !interests.includes(interest)
  );

  // Filter OCCASIONS based on search input
  const filteredOccasions = OCCASIONS.filter((o) =>
    o.toLowerCase().includes(occasionSearch.toLowerCase())
  );

  // Reset highlighted index when input or suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [inputInterest, filteredSuggestions.length]);

  // Reset highlighted occasion index when search changes
  useEffect(() => {
    setHighlightedOccasionIndex(-1);
  }, [occasionSearch, filteredOccasions.length]);

  // Scroll to highlighted item in dropdown
  useEffect(() => {
    if (
      showCustomOccasionSelector &&
      highlightedOccasionIndex >= 0 &&
      occasionListRef.current
    ) {
      const highlightedElement = occasionListRef.current.children[
        highlightedOccasionIndex
      ] as HTMLElement;

      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedOccasionIndex, showCustomOccasionSelector]);

  // Handle keyboard navigation for occasion dropdown
  useEffect(() => {
    if (!showCustomOccasionSelector) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedOccasionIndex((prevIndex) =>
            prevIndex < filteredOccasions.length - 1 ? prevIndex + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedOccasionIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : filteredOccasions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedOccasionIndex >= 0 &&
            highlightedOccasionIndex < filteredOccasions.length
          ) {
            handleSelectOccasion(filteredOccasions[highlightedOccasionIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowCustomOccasionSelector(false);
          setOccasionSearch("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showCustomOccasionSelector, highlightedOccasionIndex, filteredOccasions]);

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

    // Pass the current occasion to the parent component
    setOccasion(occasion);

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

  // Handle selecting an occasion from the custom dropdown
  const handleSelectOccasion = (selectedOccasion: string) => {
    setOccasionState(selectedOccasion);
    setShowCustomOccasionSelector(false);
    setOccasionSearch("");
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto mt-8 rounded-xl border border-[#FF8200]/10 bg-[#191816] p-6 sm:p-12 flex flex-col gap-8"
      style={{
        boxShadow:
          "0 0 80px 0 rgba(255,130,0,0.18), 0 0 0 1px rgba(255,130,0,0.08), 0 0 120px 0 rgba(255,130,0,0.10)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="flex flex-col sm:flex-row gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Occasion */}
        <motion.div
          className="flex-1 flex flex-col items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.label
            className="text-white text-xl mb-4 font-sans"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Occasion
          </motion.label>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.6,
              duration: 0.4,
              type: "spring",
              stiffness: 200,
            }}
            className="w-full"
          >
            {/* Custom occasion selector that maintains focus */}
            <div className="relative w-full max-w-md">
              <div
                className="w-full max-w-md bg-[#191816] border border-[#333] text-lg text-white rounded-xl h-14 px-6 flex items-center justify-between cursor-pointer hover:border-[#FF8200]/40 transition-colors"
                onClick={() => setShowCustomOccasionSelector(true)}
              >
                <span>{occasion || "Select occasion"}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-200 ${
                    showCustomOccasionSelector ? "rotate-180" : ""
                  }`}
                />
              </div>

              <AnimatePresence>
                {showCustomOccasionSelector && (
                  <motion.div
                    className="absolute left-0 right-0 top-full z-50 mt-2 bg-[#191816] border border-[#333] rounded-xl shadow-xl overflow-hidden"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Search input that stays focused */}
                    <div className="sticky top-0 z-10 bg-[#191816] p-3 border-b border-[#333]">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          ref={occasionSearchRef}
                          type="text"
                          value={occasionSearch}
                          onChange={(e) => setOccasionSearch(e.target.value)}
                          placeholder="Search occasions..."
                          className="w-full pl-9 pr-4 py-2 bg-transparent border border-[#333] rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#FF8200]"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Occasion list with scrollbar */}
                    <div
                      ref={occasionListRef}
                      className="max-h-[240px] overflow-y-auto custom-scrollbar"
                    >
                      {filteredOccasions.length > 0 ? (
                        filteredOccasions.map((o, index) => (
                          <motion.div
                            key={o}
                            className={`px-6 py-3 cursor-pointer transition-colors ${
                              index === highlightedOccasionIndex
                                ? "bg-[#FF8200] text-black"
                                : o === occasion
                                ? "bg-[#FF8200]/20 text-white"
                                : "hover:bg-[#FF8200]/20 hover:text-white"
                            }`}
                            onClick={() => handleSelectOccasion(o)}
                            onMouseEnter={() =>
                              setHighlightedOccasionIndex(index)
                            }
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02, duration: 0.15 }}
                          >
                            {o}
                          </motion.div>
                        ))
                      ) : (
                        <div className="px-6 py-3 text-gray-400">
                          No occasions found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Backdrop to close dropdown when clicking outside */}
              {showCustomOccasionSelector && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setShowCustomOccasionSelector(false);
                    setOccasionSearch("");
                  }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Interests */}
        <motion.div
          className="flex-1 flex flex-col items-center relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.label
            className="text-white text-xl mb-4 font-sans"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Interests
          </motion.label>
          <motion.div
            className="w-full max-w-md min-h-[96px] bg-[#191816] border border-[#333] rounded-xl flex flex-wrap items-start gap-2 p-4 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.7,
              duration: 0.4,
              type: "spring",
              stiffness: 200,
            }}
          >
            {interests.map((interest, index) => (
              <motion.span
                key={interest}
                className="flex items-center bg-[#FF8200]/10 border border-[#FF8200]/30 text-white px-4 py-2 rounded-full text-base font-medium gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,130,0,0.2)",
                }}
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-1 focus:outline-none"
                  aria-label={`Remove ${interest}`}
                >
                  <X size={18} className="text-[#FF8200] cursor-pointer" />
                </button>
              </motion.span>
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
              <AnimatePresence>
                {(showSuggestions ||
                  inputRef.current === document.activeElement) &&
                  filteredSuggestions.length > 0 && (
                    <motion.div
                      className="absolute left-0 top-10 z-10 bg-[#191816] border border-[#333] rounded-lg shadow-lg w-64"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
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
                          <div className="px-4 py-2 text-gray-400">
                            No options
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Buttons - updated styling and reduced bounciness */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Button
            className="bg-[#FF8200] cursor-pointer hover:bg-orange-600 text-black font-semibold px-10 py-6 rounded-full text-lg"
            onClick={generateGiftIdeas}
            disabled={interests.length === 0}
          >
            Generate Ideas
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Button
            variant="outline"
            className={clsx(
              "border border-[#FF8200]/30 bg-[#FF8200]/10 cursor-pointer hover:text-white px-10 py-6 rounded-full text-lg flex items-center gap-2",
              "hover:bg-[#FF8200]/20"
            )}
            onClick={handleSurpriseMe}
            disabled={false}
          >
            Surprise me <Sparkles className="ml-2 w-5 h-5 text-[#FF8200]" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.p
          className="text-red-500 text-center mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
