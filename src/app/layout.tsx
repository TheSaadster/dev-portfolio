import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const sans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-sans", weight: "100 900" });
const mono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-mono", weight: "100 900" });

const description =
  "Saad is a full-stack developer. He built Chess It Up and makes YouTube videos about development.";

export const metadata: Metadata = {
  metadataBase: new URL("https://thesaadster.vercel.app"),
  title: "Saad | Full-Stack Developer",
  description,
  openGraph: {
    title: "Saad | Full-Stack Developer",
    description,
    url: "/",
    siteName: "Saad",
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@thesaadster_dev" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}>
        <Analytics />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
