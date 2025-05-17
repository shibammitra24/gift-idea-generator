"use client";

import { Heart, Search, BookmarkIcon, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Update interface to match the structure from route.ts prompt
interface GiftIdea {
  title: string;
  desc: string;
  budget: string;
  likeMeter: string;
  // Add an optional id field to help with identification
  id?: string;
}

interface GiftSectionProps {
  isGenerating: boolean;
  giftIdeas: GiftIdea[];
  occasion?: string;
}

export default function GiftSection({
  isGenerating,
  giftIdeas,
  occasion = "gift",
}: GiftSectionProps) {
  const hasGeneratedIdeas = giftIdeas.length > 0;
  const [savedIdeas, setSavedIdeas] = useState<GiftIdea[]>([]);

  // Load saved ideas from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("savedGiftIdeas");
    if (saved) {
      try {
        setSavedIdeas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved gift ideas", e);
      }
    }
  }, []);

  // Create unique ID for an idea
  const createIdeaId = (idea: GiftIdea): string => {
    // Create a stable ID based on title and desc
    return btoa(idea.title + ":" + idea.desc).replace(/[^a-zA-Z0-9]/g, "");
  };

  // Save an idea to localStorage
  const saveIdea = (idea: GiftIdea) => {
    // Ensure we have a clean idea object
    const cleanedIdea = {
      title: cleanText(idea.title || ""),
      desc: cleanText(idea.desc || ""),
      budget: cleanText(idea.budget || ""),
      likeMeter: cleanText(idea.likeMeter || ""),
      id: idea.id || createIdeaId(idea),
    };

    // Check if idea is already saved using ID if available, or content comparison as fallback
    const isAlreadySaved = savedIdeas.some(
      (savedIdea) =>
        (cleanedIdea.id && savedIdea.id === cleanedIdea.id) ||
        (savedIdea.title === cleanedIdea.title &&
          savedIdea.desc === cleanedIdea.desc)
    );

    if (isAlreadySaved) {
      // Remove the idea if already saved (toggle functionality)
      const newSavedIdeas = savedIdeas.filter(
        (savedIdea) =>
          !(
            (cleanedIdea.id && savedIdea.id === cleanedIdea.id) ||
            (savedIdea.title === cleanedIdea.title &&
              savedIdea.desc === cleanedIdea.desc)
          )
      );
      setSavedIdeas(newSavedIdeas);

      // Ensure we're saving a valid string to localStorage
      try {
        localStorage.setItem("savedGiftIdeas", JSON.stringify(newSavedIdeas));
        console.log(
          "Successfully removed idea, saved ideas count:",
          newSavedIdeas.length
        );
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    } else {
      // Add the idea
      const newSavedIdeas = [...savedIdeas, cleanedIdea];
      setSavedIdeas(newSavedIdeas);

      // Ensure we're saving a valid string to localStorage
      try {
        localStorage.setItem("savedGiftIdeas", JSON.stringify(newSavedIdeas));
        console.log(
          "Successfully saved idea, saved ideas count:",
          newSavedIdeas.length
        );
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    }
  };

  // Check if an idea is saved
  const isIdeaSaved = (idea: GiftIdea): boolean => {
    const cleanedTitle = cleanText(idea.title || "");
    const cleanedDesc = cleanText(idea.desc || "");
    const id = idea.id || createIdeaId(idea);

    return savedIdeas.some(
      (savedIdea) =>
        (savedIdea.id && savedIdea.id === id) ||
        (savedIdea.title === cleanedTitle && savedIdea.desc === cleanedDesc)
    );
  };

  // Function to clean text from markdown artifacts
  const cleanText = (text: string): string => {
    if (!text) return "";
    // Remove markdown code blocks and trim
    return text.replace(/```[a-z]*|```/g, "").trim();
  };

  // Function to get emoji based on gift title keywords
  const getGiftEmoji = (title: string): string => {
    const t = (title || "").toLowerCase();

    if (
      t.includes("headphone") ||
      t.includes("earbuds") ||
      t.includes("audio")
    ) {
      return "🎧";
    } else if (t.includes("speaker") || t.includes("sound")) {
      return "🔊";
    } else if (t.includes("camera") || t.includes("photo")) {
      return "📸";
    } else if (t.includes("book") || t.includes("reading")) {
      return "📚";
    } else if (t.includes("game") || t.includes("gaming")) {
      return "🎮";
    } else if (
      t.includes("art") ||
      t.includes("creative") ||
      t.includes("paint")
    ) {
      return "🎨";
    } else if (
      t.includes("coffee") ||
      t.includes("tea") ||
      t.includes("drink")
    ) {
      return "☕";
    } else if (
      t.includes("eco") ||
      t.includes("reusable") ||
      t.includes("sustainable")
    ) {
      return "♻️";
    } else if (t.includes("music") || t.includes("playlist")) {
      return "🎵";
    } else if (t.includes("cook") || t.includes("kitchen")) {
      return "🍳";
    } else if (t.includes("plant") || t.includes("garden")) {
      return "🪴";
    } else if (t.includes("tech") || t.includes("gadget")) {
      return "📱";
    } else if (t.includes("puzzle") || t.includes("brain")) {
      return "🧩";
    } else if (t.includes("travel") || t.includes("adventure")) {
      return "✈️";
    } else if (t.includes("watch") || t.includes("time")) {
      return "⌚";
    }
    // Default gift emoji
    return "🎁";
  };

  // Function to convert likeMeter string to percentage
  const getLikeMeterPercentage = (likeMeter: string): number => {
    if (!likeMeter) return 75; // Default value

    // Clean the input
    const cleanedMeter = cleanText(likeMeter);

    // Handle different formats (numeric, descriptive)
    if (!isNaN(Number(cleanedMeter))) {
      // If it's a number, interpret as percentage or rating
      const num = Number(cleanedMeter);
      if (num <= 10) return num * 10; // Assuming 1-10 scale
      if (num <= 100) return num; // Assuming percentage
      return 75; // Default fallback
    }

    // Handle text descriptions
    const lowTerms = ["low", "poor", "bad"];
    const mediumTerms = ["medium", "moderate", "average", "ok"];
    const highTerms = ["high", "great", "excellent", "perfect", "love"];

    const lowerLikeMeter = cleanedMeter.toLowerCase();

    if (lowTerms.some((term) => lowerLikeMeter.includes(term))) return 40;
    if (mediumTerms.some((term) => lowerLikeMeter.includes(term))) return 70;
    if (highTerms.some((term) => lowerLikeMeter.includes(term))) return 90;

    return 75; // Default value
  };

  // Function to render the saved ideas section
  const renderSavedIdeasSection = () => {
    if (savedIdeas.length === 0) return null;

    return (
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6">
          Your Saved Ideas{" "}
          <span className="text-[#FF8200]">({savedIdeas.length})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedIdeas.map((idea, index) => (
            <div
              key={`saved-${index}`}
              className="bg-[#191816] border border-[#FF8200]/30 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="text-3xl">{getGiftEmoji(idea.title)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate">
                  {idea.title}
                </h4>
                <p className="text-gray-400 text-xs truncate">{idea.desc}</p>
              </div>
              <button
                onClick={() => saveIdea(idea)}
                className="ml-auto text-[#FF8200] hover:opacity-75 flex-shrink-0"
              >
                <BookmarkCheck size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // If we have saved ideas but no generated ideas, show the saved ideas first
  if (!hasGeneratedIdeas && !isGenerating && savedIdeas.length > 0) {
    return (
      <div className="w-full py-16 px-4">
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{
              background:
                "radial-gradient(circle, rgba(255,130,0,0.2) 0%, rgba(255,130,0,0.05) 70%)",
              boxShadow: "0 0 40px 0 rgba(255,130,0,0.15)",
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <div className="text-5xl">🎁</div>
          </motion.div>

          <h2 className="text-3xl font-semibold text-white mb-4">
            Create New Gift Ideas
          </h2>

          <p className="text-gray-400 max-w-md text-center">
            Select an occasion, add some interests, and click
            <span className="text-[#FF8200] font-medium">
              {" "}
              "Generate Ideas"{" "}
            </span>
            to see personalized suggestions
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-gray-800">
          {renderSavedIdeasSection()}
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="w-full py-24 px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{
            background:
              "radial-gradient(circle, rgba(255,130,0,0.2) 0%, rgba(255,130,0,0.05) 70%)",
            boxShadow: "0 0 40px 0 rgba(255,130,0,0.15)",
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <div className="text-5xl animate-pulse">🎁</div>
        </motion.div>

        <h2 className="text-3xl font-semibold text-white mb-4">
          Generating ideas for you...
        </h2>

        <p className="text-gray-400 max-w-md text-center">
          Our AI is crafting personalized gift suggestions based on your
          preferences
        </p>
      </div>
    );
  }

  if (!hasGeneratedIdeas) {
    return (
      <div className="w-full py-24 px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{
            background:
              "radial-gradient(circle, rgba(255,130,0,0.2) 0%, rgba(255,130,0,0.05) 70%)",
            boxShadow: "0 0 40px 0 rgba(255,130,0,0.15)",
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <div className="text-5xl">🎁</div>
        </motion.div>

        <h2 className="text-3xl font-semibold text-white mb-4">
          No gift ideas yet
        </h2>

        <p className="text-gray-400 max-w-md text-center">
          Select an occasion, add some interests, and click
          <span className="text-[#FF8200] font-medium"> "Generate Ideas" </span>
          to see personalized suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-4">
      <h2 className="text-4xl font-semibold text-center mb-12">
        <span className="text-white">your </span>
        <span className="text-[#FF8200] italic font-bold">{occasion}</span>
        <span className="text-white"> gift ideas</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {giftIdeas.map((idea, index) => {
          const cleanTitle = cleanText(idea.title || "Gift Idea");
          const cleanDesc = cleanText(
            idea.desc || "Perfect for someone special"
          );
          const cleanBudget = cleanText(idea.budget || "Mid-range");
          const cleanIdea = {
            title: cleanTitle,
            desc: cleanDesc,
            budget: cleanBudget,
            likeMeter: cleanText(idea.likeMeter || "80%"),
            id: createIdeaId({ ...idea, title: cleanTitle, desc: cleanDesc }),
          };
          const saved = isIdeaSaved(cleanIdea);

          return (
            <motion.div
              key={index}
              className="bg-[#191816] border border-[#FF8200]/10 rounded-xl p-6 hover:border-[#FF8200]/30 transition-colors flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              {/* Emoji Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className="text-6xl"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,130,0,0.3))" }}
                >
                  {getGiftEmoji(cleanTitle)}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                {cleanTitle}
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-auto text-center text-sm leading-relaxed">
                {cleanDesc}
              </p>

              {/* Bottom section */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                {/* Rating meter */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-gray-400" />
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#FF8200] rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${getLikeMeterPercentage(
                            idea.likeMeter || "80%"
                          )}%`,
                        }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Price range */}
                  <span className="text-xs text-gray-400">{cleanBudget}</span>
                </div>

                {/* Action buttons row */}
                <div className="flex justify-between items-center mt-3">
                  {/* Save idea button */}
                  <motion.button
                    onClick={() => saveIdea(cleanIdea)}
                    className={`text-xs flex items-center gap-1 transition-colors ${
                      saved
                        ? "text-[#FF8200]"
                        : "text-gray-400 hover:text-[#FF8200]"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {saved ? (
                      <>
                        <BookmarkCheck size={14} /> Saved
                      </>
                    ) : (
                      <>
                        <BookmarkIcon size={14} /> Save idea
                      </>
                    )}
                  </motion.button>

                  {/* Find online button */}
                  <motion.button
                    className="text-[#FF8200] hover:underline text-xs flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    Find it online <Search size={12} className="ml-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Saved ideas section - only shown if there are saved ideas */}
      {savedIdeas.length > 0 && (
        <div className="mt-16 pt-12 border-t border-gray-800">
          {renderSavedIdeasSection()}
        </div>
      )}
    </div>
  );
}
