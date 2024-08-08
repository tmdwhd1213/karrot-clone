import type { Metadata } from "next";
import { Inter, Noto_Sans, Rubik_Scribble } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const NOTO_SANS = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
  variable: "--noto-text",
});

const rubick = Rubik_Scribble({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--test-text",
});

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
        className={`${NOTO_SANS.variable} ${rubick.variable}
         bg-neutral-900  text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
