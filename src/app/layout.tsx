import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const libreCaslonText = Libre_Caslon_Text({
  variable: "--font-libre-caslon-text",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Gift Idea Generator",
  description: "AI-powered gift recommendations for any occasion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <head>
        {/* Force refresh cache to ensure latest styles are applied */}
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`
          ${inter.variable} ${libreCaslonText.variable} antialiased
          bg-[#0A0903] text-white min-h-screen selection:bg-orange-600/20
        `}
      >
        {/* Main content container with fixed dimensions */}
        <div
          className="mx-auto w-full min-h-screen flex flex-col items-center"
          style={{
            maxWidth: "100%",
            padding: "0 16px", // Explicit padding
          }}
        >
          <div
            className="w-full max-w-[1536px] flex flex-col items-center"
            style={{
              margin: "0 auto",
              width: "100%",
            }}
          >
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
