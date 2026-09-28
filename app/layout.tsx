import type { Metadata, Viewport } from "next";
import { Lilita_One, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ToastProvider } from "@/components/ui/toast";
import { ServiceWorkerRegister } from "@/components/pwa-register";
import { cn } from "@/lib/utils";

// Barriecito isn't on Google Fonts — Lilita One is the closest licensed match.
const display = Lilita_One({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zingwangwa Street Foods — Good Food. Great Vibes.",
    template: "%s · Zingwangwa Street Foods",
  },
  description:
    "Sizzling street food at Zingwangwa Market, next to 99 Club. Signature shawarma, grilled chicken & chips, snacks and cupcakes. Good Food. Great Vibes.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#BF4C00",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(display.variable, sans.variable)}>
      <body className="flex min-h-screen flex-col">
        <ToastProvider>
          <ServiceWorkerRegister />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </ToastProvider>
      </body>
    </html>
  );
}
