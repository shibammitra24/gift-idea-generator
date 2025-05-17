"use client";

import { Gift } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <>
      <motion.nav
        className="w-full flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 bg-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.span
            className="bg-[#FF8200]/10 rounded-full p-2 text-2xl sm:text-3xl"
            role="img"
            aria-label="gift"
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeatDelay: 3,
              }}
            >
              <Gift className="h-8 w-8 text-[#FF8200]" strokeWidth={1.5} />
            </motion.div>
          </motion.span>
          <motion.span
            className="text-white text-2xl sm:text-3xl font-serif"
            style={{ fontFamily: "var(--font-libre-caslon-text), serif" }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Gift <span className="not-italic">'o</span> me
          </motion.span>
        </motion.div>
        <motion.a
          href="#"
          className="bg-[#FF8200] hover:bg-orange-600 text-black font-semibold px-3 py-2 sm:px-4 rounded transition-colors text-sm sm:text-base"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(255, 130, 0, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Feedback
        </motion.a>
      </motion.nav>
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
    </>
  );
}
