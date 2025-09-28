import "@workspace/ui/globals.css";
import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { Toaster } from "@workspace/ui/components/sonner";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Echo",
  description:
    "Transform your business with Echo's AI-powered chatbots and voice assistants. Embed intelligent customer support widgets in minutes. 24/7 automated support, voice integration, real-time analytics. Get started free.",
  keywords: [
    "AI chatbot",
    "customer support automation",
    "voice assistant",
    "B2B SaaS",
    "chat widget",
    "customer service AI",
    "business automation",
    "live chat software",
    "conversational AI",
    "customer engagement platform",
    "support ticket automation",
    "AI phone support",
    "embeddable chat widget",
    "multi-tenant chatbot",
    "real-time customer support",
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
        <ClerkProvider appearance={{ variables: { colorPrimary: "#3C82F6" } }}>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
