import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { RequestProvider } from "@/context/RequestContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ToastProvider from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Health Seva - Community Healthcare Platform",
  description: "Connect with healthcare providers, find blood donors, and access medical resources in your community.",
  keywords: "healthcare, blood donation, medical stores, community health, emergency medical services",
  authors: [{ name: "Health Seva Team" }],
  openGraph: {
    title: "Health Seva - Community Healthcare Platform",
    description: "Connect with healthcare providers and find blood donors in your community",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors`}>
        <ThemeProvider>
          <RequestProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <ToastProvider />
          </RequestProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
