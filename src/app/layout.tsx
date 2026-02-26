import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Saad | Full-Stack Developer",
  description: "Full-Stack Developer portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <Analytics />
        <Navbar />
        {children}
      </body>
    </html>
  );
}