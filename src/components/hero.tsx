"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center py-16 bg-gradient-to-b from-[#0A0903] to-transparent overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-white font-serif text-4xl sm:text-5xl font-normal leading-tight"
          style={{ fontFamily: "var(--font-libre-caslon-text), serif" }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          Find the{" "}
          <motion.span
            className="inline-block whitespace-nowrap italic text-[#FF8200] font-bold relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            perfect gift
            <motion.span
              className="absolute left-0 bottom-0 w-full h-[3px] bg-[#FF8200]"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            />
          </motion.span>
          <br />
          Every time
        </motion.h1>

        <motion.p
          className="mt-8 text-gray-400 text-base sm:text-md opacity-70 font-light max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          Generate thoughtful and personalized gift ideas for any occasion in
          seconds
        </motion.p>
      </motion.div>
    </section>
  );
}
