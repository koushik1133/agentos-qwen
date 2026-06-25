import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentSwarm AI",
  description: "Multi-agent manufacturing operating system powered by Qwen Cloud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${inter.variable} font-sans antialiased selection:bg-white/20`}
      >
        {children}
      </body>
    </html>
  );
}
