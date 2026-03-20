import type { Metadata } from "next";
import { Lato, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/scroll-to-top";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.city}, ${siteConfig.location}`,
  description: `${siteConfig.tagline} Classical Pilates studio in ${siteConfig.city}, ${siteConfig.location}. Reformer, private & group classes.`,
  keywords: [
    "Pilates",
    siteConfig.city,
    siteConfig.location,
    "reformer",
    "fitness",
    "Pilates studio",
  ],
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.city}, ${siteConfig.location}`,
    description: `${siteConfig.tagline} Classical Pilates studio in ${siteConfig.city}, ${siteConfig.location}.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.city}, ${siteConfig.location}`,
    description: `${siteConfig.tagline} Classical Pilates studio in ${siteConfig.city}.`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lato.variable} ${cormorantGaramond.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollToTop />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
