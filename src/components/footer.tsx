"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative mt-auto w-full">
      {/* Gradient overlay at bottom */}
      <motion.div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, #0A0903 0%, #888 50%, #0A0903 100%)",
        }}
        initial={{ opacity: 0, scaleX: 0.7 }}
        animate={{ opacity: 0.3, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />

      <div className="py-6 px-4 text-center relative z-10 max-w-6xl mx-auto">
        <p className="text-gray-500 text-sm">
          © 2025 Giftoid | Smart Gift Idea Generator
        </p>
      </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "80px",
        background: "linear-gradient(0deg, rgba(255,130,0,0.18) 0%, rgba(255,130,0,0.10) 60%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.5,
      }}
      className="w-full"
    ></div>
    </footer>
  );
}
