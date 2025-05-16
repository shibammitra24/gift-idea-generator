export default function Navbar() {
  return (
    <>
      <nav
        className="w-full flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 bg-transparent"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl" role="img" aria-label="gift">
            🎁
          </span>
          <span
            className="text-white text-2xl sm:text-3xl font-serif"
            style={{ fontFamily: "var(--font-libre-caslon-text), serif" }}
          >
            Gift <span className="not-italic">‘o</span> me
          </span>
        </div>
        <a
          href="#"
          className="bg-[#FF8200] hover:bg-orange-600 text-black font-semibold px-3 py-2 sm:px-4 rounded transition-colors text-sm sm:text-base"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Feedback
        </a>
      </nav>
      <div
        className="w-full h-px"
        style={{
          background: "linear-gradient(90deg, #0A0903 0%, #888 50%, #0A0903 100%)",
          opacity: 0.3,
        }}
      />
    </>
  );
}