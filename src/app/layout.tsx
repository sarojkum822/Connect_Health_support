import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { RequestProvider } from "@/context/RequestContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MERN Health App",
  description: "A healthcare application built with MERN stack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RequestProvider>
          <Navbar />
          <main className="pt-16 min-h-screen bg-gray-50">
            {children}
          </main>
        </RequestProvider>
      </body>
    </html>
  );
}
