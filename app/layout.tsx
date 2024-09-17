import "./globals.css";

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ReactNode } from "react";

import { Toaster } from "@/app/_components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  description: "TodoList app built with Clean Architecture",
  title: "Ultimate TodoList - CleanArchi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} h-screen font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
