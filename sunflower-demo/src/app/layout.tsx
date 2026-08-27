import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Kalam } from "next/font/google";
import { SunCursor } from "@/components/SunCursor";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helianthus | The Sun Follower",
  description: "A comprehensive exploration of the sunflower.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${kalam.variable} font-sans bg-[#DDA826] text-[#F9F8F4] antialiased selection:bg-[#F9F8F4] selection:text-[#DDA826]`}
      >
        <SunCursor />
        {children}
      </body>
    </html>
  );
}
