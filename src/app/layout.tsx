import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/custom/SmoothScroll";
import PageTransitionProvider from "@/components/custom/PageTransition";
import PostHogProvider from "@/components/custom/PostHogProvider";
import AnalyticsTracker from "@/components/custom/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orange Studios",
  description: "Creative design studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <Suspense fallback={null}>
          <PostHogProvider>
            <AnalyticsTracker />
            <PageTransitionProvider>
              <SmoothScroll>{children}</SmoothScroll>
            </PageTransitionProvider>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
