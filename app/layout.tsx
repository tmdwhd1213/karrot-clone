import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | 오이마켓",
    default: "오이마켓",
  },
  description: "이웃과 함께하는 중고거래",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-900 
        text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
