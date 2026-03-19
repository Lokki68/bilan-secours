import { BilanProvider } from "@/context/BilanContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {MobileNav} from "@/components/layout/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bilan Secours",
  description: "Outil d'aide à la réalisation et la transmission de bilan secours pompiers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-gray-950 text-white">
        <BilanProvider>
          <div className="min-h-screen flex flex-col max-w-lg mx-auto relative">
            <div className="bg-gray-900 h-safe-top " />
            <main className="flex-1 flex flex-col overflow-y-auto">
              {children}
            </main>
            <div className="bg-gray-950 h-safe-bottom" />
          </div>
        </BilanProvider>
        </body>
    </html>
  );
}
