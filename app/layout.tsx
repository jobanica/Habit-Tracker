import type { Metadata, Viewport } from "next";
import { config } from "@/lib/config";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: config.pageTitle,
  description: config.metaDescription,
  openGraph: {
    title: config.pageTitle,
    description: config.metaDescription,
    url: appUrl,
    siteName: config.productName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.pageTitle,
    description: config.metaDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
