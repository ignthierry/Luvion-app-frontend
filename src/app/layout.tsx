import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import CustomCursor from "@/components/CustomCursor";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luvion - AI-Driven Scale Up Platform",
  description: "Luvion helps businesses scale up through digital system integration, AI module recommendations, and transparent modular pricing.",
  keywords: ["SaaS", "Business", "Scale Up", "AI Integration", "Digital Platform"],
  authors: [{ name: "Thierry (Founder)" }],
  icons: {
    icon: "/logo2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      >
        <Providers>
          {children}
          <CustomCursor />
        </Providers>
      </body>
    </html>
  );
}
