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
      <body
        className={`
          ${inter.variable} ${libreCaslonText.variable} antialiased
          bg-[#0A0903] text-white min-h-screen selection:bg-orange-600/20
        `}
      >
        <div
          className="
            min-h-screen flex flex-col items-center mx-auto
            w-full
            px-4
            sm:px-8
          "
        >
          <div className="w-full flex flex-col items-center">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
