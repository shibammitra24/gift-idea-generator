"use client";

import { Heart, Search, BookmarkIcon, BookmarkCheck, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

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
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [activePopupIdea, setActivePopupIdea] = useState<GiftIdea | null>(null);

  // Add ref for the gift ideas section
  const giftIdeasSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to gift ideas when they're generated
  useEffect(() => {
    if (giftIdeas.length > 0 && giftIdeasSectionRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        giftIdeasSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [giftIdeas]);

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

    // Technology & Electronics
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
    } else if (
      t.includes("tech") ||
      t.includes("gadget") ||
      t.includes("electronic")
    ) {
      return "📱";
    } else if (
      t.includes("computer") ||
      t.includes("laptop") ||
      t.includes("pc")
    ) {
      return "💻";
    } else if (t.includes("watch") || t.includes("time")) {
      return "⌚";
    } else if (t.includes("phone") || t.includes("smartphone")) {
      return "📱";
    }

    // Media & Entertainment
    else if (
      t.includes("book") ||
      t.includes("reading") ||
      t.includes("novel")
    ) {
      return "📚";
    } else if (
      t.includes("game") ||
      t.includes("gaming") ||
      t.includes("console")
    ) {
      return "🎮";
    } else if (
      t.includes("movie") ||
      t.includes("film") ||
      t.includes("cinema")
    ) {
      return "🎬";
    } else if (
      t.includes("music") ||
      t.includes("playlist") ||
      t.includes("song")
    ) {
      return "🎵";
    } else if (t.includes("podcast") || t.includes("audio show")) {
      return "🎙️";
    } else if (t.includes("anime") || t.includes("manga")) {
      return "🇯🇵";
    } else if (t.includes("comic") || t.includes("superhero")) {
      return "💫";
    } else if (
      t.includes("theatre") ||
      t.includes("theater") ||
      t.includes("drama")
    ) {
      return "🎭";
    } else if (
      t.includes("writing") ||
      t.includes("journal") ||
      t.includes("pen")
    ) {
      return "✍️";
    }

    // Hobbies & Crafts
    else if (
      t.includes("art") ||
      t.includes("creative") ||
      t.includes("paint")
    ) {
      return "🎨";
    } else if (
      t.includes("craft") ||
      t.includes("handmade") ||
      t.includes("diy")
    ) {
      return "🧶";
    } else if (t.includes("collect") || t.includes("memorabilia")) {
      return "🏆";
    } else if (t.includes("photography") || t.includes("photographer")) {
      return "📷";
    } else if (
      t.includes("board game") ||
      t.includes("puzzle") ||
      t.includes("brain")
    ) {
      return "🧩";
    }

    // Food & Drink
    else if (t.includes("coffee") || t.includes("espresso")) {
      return "☕";
    } else if (t.includes("tea") || t.includes("teapot")) {
      return "🍵";
    } else if (
      t.includes("cook") ||
      t.includes("kitchen") ||
      t.includes("chef")
    ) {
      return "🍳";
    } else if (
      t.includes("baking") ||
      t.includes("baker") ||
      t.includes("cake")
    ) {
      return "🧁";
    } else if (t.includes("wine") || t.includes("vineyard")) {
      return "🍷";
    } else if (
      t.includes("beer") ||
      t.includes("brewery") ||
      t.includes("ale")
    ) {
      return "🍺";
    } else if (
      t.includes("food") ||
      t.includes("gourmet") ||
      t.includes("culinary")
    ) {
      return "🍽️";
    }

    // Home & Lifestyle
    else if (
      t.includes("plant") ||
      t.includes("garden") ||
      t.includes("flower")
    ) {
      return "🪴";
    } else if (
      t.includes("home") ||
      t.includes("decor") ||
      t.includes("interior")
    ) {
      return "🏠";
    } else if (
      t.includes("architecture") ||
      t.includes("design") ||
      t.includes("building")
    ) {
      return "🏛️";
    } else if (
      t.includes("beauty") ||
      t.includes("makeup") ||
      t.includes("cosmetic")
    ) {
      return "💄";
    } else if (
      t.includes("fashion") ||
      t.includes("style") ||
      t.includes("wear")
    ) {
      return "👕";
    } else if (t.includes("pet") || t.includes("dog") || t.includes("cat")) {
      return "🐾";
    }

    // Sports & Fitness
    else if (
      t.includes("sport") ||
      t.includes("athletic") ||
      t.includes("team")
    ) {
      return "🏅";
    } else if (
      t.includes("fitness") ||
      t.includes("workout") ||
      t.includes("exercise")
    ) {
      return "💪";
    } else if (
      t.includes("yoga") ||
      t.includes("meditation") ||
      t.includes("zen")
    ) {
      return "🧘";
    } else if (
      t.includes("running") ||
      t.includes("jogging") ||
      t.includes("marathon")
    ) {
      return "🏃";
    } else if (
      t.includes("swimming") ||
      t.includes("pool") ||
      t.includes("water sport")
    ) {
      return "🏊";
    } else if (
      t.includes("cycling") ||
      t.includes("bike") ||
      t.includes("bicycle")
    ) {
      return "🚴";
    } else if (
      t.includes("hiking") ||
      t.includes("trek") ||
      t.includes("trail")
    ) {
      return "🥾";
    } else if (
      t.includes("camping") ||
      t.includes("outdoor") ||
      t.includes("nature")
    ) {
      return "⛺";
    } else if (t.includes("dance") || t.includes("dancing")) {
      return "💃";
    }

    // Science & Learning
    else if (
      t.includes("science") ||
      t.includes("lab") ||
      t.includes("experiment")
    ) {
      return "🧪";
    } else if (
      t.includes("history") ||
      t.includes("historical") ||
      t.includes("vintage")
    ) {
      return "📜";
    } else if (
      t.includes("space") ||
      t.includes("astronomy") ||
      t.includes("star")
    ) {
      return "🔭";
    }

    // Miscellaneous
    else if (
      t.includes("car") ||
      t.includes("auto") ||
      t.includes("automobile")
    ) {
      return "🚗";
    } else if (
      t.includes("motorcycle") ||
      t.includes("bike") ||
      t.includes("biker")
    ) {
      return "🏍️";
    } else if (
      t.includes("travel") ||
      t.includes("adventure") ||
      t.includes("trip")
    ) {
      return "✈️";
    } else if (
      t.includes("volunteer") ||
      t.includes("charity") ||
      t.includes("donate")
    ) {
      return "❤️";
    } else if (
      t.includes("wellness") ||
      t.includes("health") ||
      t.includes("self-care")
    ) {
      return "🧠";
    } else if (
      t.includes("eco") ||
      t.includes("sustainable") ||
      t.includes("reusable")
    ) {
      return "♻️";
    } else if (
      t.includes("spiritual") ||
      t.includes("mindful") ||
      t.includes("calm")
    ) {
      return "🕉️";
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
              className="bg-[#191816] border border-[#FF8200]/30 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-[#1E1C1A] transition-colors"
              onClick={() => setActivePopupIdea(idea)}
            >
              <div className="text-3xl">{getGiftEmoji(idea.title)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate">
                  {idea.title}
                </h4>
                <p className="text-gray-400 text-xs truncate">{idea.desc}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening popup when removing
                  saveIdea(idea);
                }}
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

        {/* Add popup here as well */}
        {activePopupIdea && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
            style={{
              touchAction: "none",
              overscrollBehavior: "contain",
            }}
            onClick={() => setActivePopupIdea(null)}
          >
            <motion.div
              className="bg-[#191816] border-2 border-[#FF8200]/30 rounded-xl w-[calc(100%-32px)] max-w-md max-h-[80vh] overflow-hidden relative m-4 z-[9999]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-[9999] p-2 cursor-pointer"
                onClick={() => setActivePopupIdea(null)}
                aria-label="Close popup"
              >
                <X size={28} />
              </button>

              <div className="p-6 sm:p-8 overflow-y-auto max-h-[80vh]">
                {/* Emoji Icon */}
                <div className="flex justify-center mb-6 pt-2">
                  <div
                    className="text-6xl"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(255,130,0,0.3))",
                    }}
                  >
                    {getGiftEmoji(activePopupIdea.title)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 text-center">
                  {activePopupIdea.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-8 text-center text-sm leading-relaxed">
                  {activePopupIdea.desc}
                </p>

                {/* Bottom section */}
                <div className="pt-4 border-t border-gray-800">
                  {/* Rating meter */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Heart size={18} className="text-gray-400" />
                      <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#FF8200] rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${getLikeMeterPercentage(
                              activePopupIdea.likeMeter || "80%"
                            )}%`,
                          }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <span className="text-xs text-white font-medium">
                        {getLikeMeterPercentage(
                          activePopupIdea.likeMeter || "80%"
                        )}
                        %
                      </span>
                    </div>

                    {/* Price range */}
                    <span className="text-xs text-gray-400 font-medium">
                      {activePopupIdea.budget}
                    </span>
                  </div>

                  {/* Action buttons row - simplified for all devices */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    {/* Remove from saved button - simplified handler */}
                    <button
                      className="border border-[#FF8200]/30 text-[#FF8200] px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 w-full hover:bg-[#FF8200]/10 transition-colors cursor-pointer"
                      onClick={() => {
                        saveIdea(activePopupIdea);
                        setActivePopupIdea(null);
                      }}
                    >
                      <BookmarkCheck size={16} /> Remove from saved
                    </button>

                    {/* Find online button - simplified handler */}
                    <button
                      className="bg-[#FF8200] text-black px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 w-full hover:bg-[#FF8200]/90 transition-colors cursor-pointer"
                      onClick={() => {
                        const searchQuery = encodeURIComponent(
                          `${activePopupIdea.title} gift`
                        );
                        window.open(
                          `https://www.google.com/search?q=${searchQuery}`,
                          "_blank"
                        );
                      }}
                    >
                      Find it online <Search size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
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
      <h2
        ref={giftIdeasSectionRef} // Add ref here to the heading
        className="text-4xl font-semibold text-center mb-12"
      >
        <span className="text-white">your </span>
        {occasion.toLowerCase() !== "gift" ? (
          <>
            <span className="text-[#FF8200] italic font-bold capitalize">
              {occasion}
            </span>
            <span className="text-white"> gift ideas</span>
          </>
        ) : (
          <span className="text-[#FF8200] italic font-bold">gift ideas</span>
        )}
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
                  <div className="flex items-center gap-2 relative">
                    <Heart size={16} className="text-gray-400" />
                    <div
                      className="w-24 h-2 bg-gray-800 rounded-full overflow-visible relative group cursor-pointer"
                      onClick={() =>
                        setActiveTooltip(activeTooltip === index ? null : index)
                      }
                      onMouseEnter={() => setActiveTooltip(index)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
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

                      {/* Mobile and desktop friendly tooltip */}
                      {activeTooltip === index && (
                        <div
                          className="absolute bottom-[18px] left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
                          style={{
                            filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
                          }}
                        >
                          <div className="bg-[#191816] border-2 border-[#FF8200] rounded-md px-3 py-2 text-xs font-medium text-white whitespace-nowrap">
                            Gift appeal:{" "}
                            {getLikeMeterPercentage(idea.likeMeter || "80%")}%
                          </div>
                          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-[#191816] absolute left-1/2 -translate-x-1/2 top-full"></div>
                        </div>
                      )}
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

                  {/* Find online button - Now with search functionality */}
                  <motion.button
                    className="text-[#FF8200] hover:underline text-xs flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Create a Google search query with the gift idea title
                      const searchQuery = encodeURIComponent(
                        `${cleanTitle} gift`
                      );
                      window.open(
                        `https://www.google.com/search?q=${searchQuery}`,
                        "_blank"
                      );
                    }}
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

      {/* Popup for saved idea details - fixed for all devices */}
      {activePopupIdea && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          style={{
            touchAction: "none",
            overscrollBehavior: "contain",
          }}
          onClick={() => setActivePopupIdea(null)}
        >
          <motion.div
            className="bg-[#191816] border-2 border-[#FF8200]/30 rounded-xl w-[calc(100%-32px)] max-w-md max-h-[80vh] overflow-hidden relative m-4 z-[9999]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-[9999] p-2 cursor-pointer"
              onClick={() => setActivePopupIdea(null)}
              aria-label="Close popup"
            >
              <X size={28} />
            </button>

            <div className="p-6 sm:p-8 overflow-y-auto max-h-[80vh]">
              {/* Emoji Icon */}
              <div className="flex justify-center mb-6 pt-2">
                <div
                  className="text-6xl"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,130,0,0.3))" }}
                >
                  {getGiftEmoji(activePopupIdea.title)}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                {activePopupIdea.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-8 text-center text-sm leading-relaxed">
                {activePopupIdea.desc}
              </p>

              {/* Bottom section */}
              <div className="pt-4 border-t border-gray-800">
                {/* Rating meter */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-gray-400" />
                    <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#FF8200] rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${getLikeMeterPercentage(
                            activePopupIdea.likeMeter || "80%"
                          )}%`,
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <span className="text-xs text-white font-medium">
                      {getLikeMeterPercentage(
                        activePopupIdea.likeMeter || "80%"
                      )}
                      %
                    </span>
                  </div>

                  {/* Price range */}
                  <span className="text-xs text-gray-400 font-medium">
                    {activePopupIdea.budget}
                  </span>
                </div>

                {/* Action buttons row - simplified for all devices */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  {/* Remove from saved button - simplified handler */}
                  <button
                    className="border border-[#FF8200]/30 text-[#FF8200] px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 w-full hover:bg-[#FF8200]/10 transition-colors cursor-pointer"
                    onClick={() => {
                      saveIdea(activePopupIdea);
                      setActivePopupIdea(null);
                    }}
                  >
                    <BookmarkCheck size={16} /> Remove from saved
                  </button>

                  {/* Find online button - simplified handler */}
                  <button
                    className="bg-[#FF8200] text-black px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 w-full hover:bg-[#FF8200]/90 transition-colors cursor-pointer"
                    onClick={() => {
                      const searchQuery = encodeURIComponent(
                        `${activePopupIdea.title} gift`
                      );
                      window.open(
                        `https://www.google.com/search?q=${searchQuery}`,
                        "_blank"
                      );
                    }}
                  >
                    Find it online <Search size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
