import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/* Brand typeface: Inter across the board — a clean modern grotesque.
   ExtraLight (200) titles · Medium (500) nav · Regular (400)
   UI · Light (300) body. */
const display = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kuwaitivirtual.example"),
  title: {
    default: "Kuwaiti Virtual — Crew Center",
    template: "%s · Kuwaiti Virtual",
  },
  description:
    "Crew Center for Kuwaiti Virtual — staff operations: pilot roster, PIREP review, applications, live flights, stats, LOA and reports.",
  robots: { index: false },
  keywords: [
    "virtual airline",
    "Kuwaiti Virtual",
    "Infinite Flight",
    "flight simulation",
    "VA",
  ],
  openGraph: {
    title: "Kuwaiti Virtual — True Arabian Hospitality in the Virtual Skies",
    description:
      "An independent Middle-Eastern virtual airline for flight simulation. Professionalism, realism and Arabian hospitality across a global network.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink-950 text-cream">
        {/* Apply saved theme before paint (default light) — avoids a flash.
            An external file (not an inline script) loaded beforeInteractive,
            so it runs before hydration without tripping React's script rules. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
