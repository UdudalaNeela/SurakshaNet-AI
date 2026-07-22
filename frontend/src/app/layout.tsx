import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import BackToTop from "@/components/BackToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: any = {
  title: "SurakshaNet AI | Digital Public Safety Platform",
  description: "An AI-powered platform for detecting, preventing, and investigating cyber fraud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased dark`}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <title>{metadata.title}</title>
      </Head>
      <body className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden overflow-y-auto">
        {/* Navigation Bar */}
        <NavBar />
        {/* Main Content */}
        <main className="flex-1 relative">
          {children}
        </main>
        {/* Back to Top button */}
        <BackToTop />
      </body>
    </html>
  );
}
