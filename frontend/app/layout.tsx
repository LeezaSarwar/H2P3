import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App | Manage Your Tasks",
  description: "A modern, simple todo application to help you stay organized and productive. Built with Next.js and FastAPI.",
  keywords: ["todo", "task management", "productivity", "organization"],
  authors: [{ name: "Leeza Sarwar", url: "https://leezaportfolio.vercel.app/" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
