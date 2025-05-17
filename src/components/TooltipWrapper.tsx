import React, { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipWrapperProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function TooltipWrapper({
  content,
  children,
  position = "top",
}: TooltipWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Position-specific styles
  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return {
          tooltip: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          arrow:
            "top-full left-1/2 transform -translate-x-1/2 border-t-[#191816] border-l-transparent border-r-transparent border-b-0",
        };
      case "bottom":
        return {
          tooltip: "top-full left-1/2 transform -translate-x-1/2 mt-2",
          arrow:
            "bottom-full left-1/2 transform -translate-x-1/2 border-b-[#191816] border-l-transparent border-r-transparent border-t-0",
        };
      case "left":
        return {
          tooltip: "right-full top-1/2 transform -translate-y-1/2 mr-2",
          arrow:
            "left-full top-1/2 transform -translate-y-1/2 border-l-[#191816] border-t-transparent border-b-transparent border-r-0",
        };
      case "right":
        return {
          tooltip: "left-full top-1/2 transform -translate-y-1/2 ml-2",
          arrow:
            "right-full top-1/2 transform -translate-y-1/2 border-r-[#191816] border-t-transparent border-b-transparent border-l-0",
        };
      default:
        return {
          tooltip: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          arrow:
            "top-full left-1/2 transform -translate-x-1/2 border-t-[#191816] border-l-transparent border-r-transparent border-b-0",
        };
    }
  };

  const { tooltip, arrow } = getPositionStyles();

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${tooltip}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-[#191816] border border-[#FF8200]/40 shadow-lg rounded-md px-3 py-2 text-xs font-medium text-white whitespace-nowrap">
              {content}
            </div>
            <div className={`absolute w-0 h-0 border-[6px] ${arrow}`}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
