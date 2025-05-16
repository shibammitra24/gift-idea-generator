export default function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center py-16 bg-gradient-to-b from-[#0A0903] to-transparent">
      <h1
        className="text-white font-serif text-4xl sm:text-5xl font-normal leading-tight"
        style={{ fontFamily: "var(--font-libre-caslon-text), serif" }}
      >
        Find the{" "}
        <span className="italic text-[#FF8200] font-bold">
          perfect gift
        </span>
        <br />
        Every time
      </h1>
      <p
        className="mt-8 text-gray-400 text-base sm:text-md opacity-70 font-light max-w-xl"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        Generate thoughtful and personalized gift ideas for any occasion in seconds
      </p>
    </section>
  );
}