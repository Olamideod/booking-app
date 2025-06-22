import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tickora - Your Event Partner",
  description: "Discover and book tickets for events near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-light-bg flex flex-col min-h-screen`}>
        <AuthProvider>
          <Suspense fallback={<header className="sticky top-0 z-40 w-full border-b bg-white h-16" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
