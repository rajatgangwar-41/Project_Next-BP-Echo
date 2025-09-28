import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { type Metadata } from "next";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Echo Chat Widget",
  description:
    "Lightweight, embeddable AI chatbot widget for websites. Easy integration with HTML, React, Next.js. Real-time customer support, customizable design, multi-language support. Under 50KB bundle size.",
  keywords: [
    "embeddable chatbot",
    "chat widget",
    "website chat plugin",
    "AI chat widget",
    "customer support widget",
    "live chat embed",
    "JavaScript chatbot",
    "React chat component",
    "responsive chat widget",
    "lightweight chat solution",
    "multi-platform chat widget",
    "customizable chat interface",
    "real-time messaging widget",
    "cross-domain chat widget",
    "mobile-friendly chat",
    "white-label chat widget",
    "SDK integration",
    "API-driven chatbot",
    "no-code chat solution",
    "plug-and-play chatbot",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <div className="w-screen h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
