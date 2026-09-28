import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "265891392925";
  return (
    <footer className="bg-brand-cacao text-brand-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="px-0" />
          <p className="mt-4 max-w-sm font-display text-xl text-brand-honey">
            Good Food. Great Vibes.
          </p>
          <p className="mt-2 max-w-sm text-brand-white/70">
            Fresh ingredients, bold flavor, generous portions — straight off the grill at
            Zingwangwa Market.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg text-brand-honey">Find Us</h3>
          <ul className="mt-3 space-y-2 text-brand-white/80">
            <li>📍 Zingwangwa Market</li>
            <li>Next to 99 Club, Blantyre</li>
            <li>🕐 Mon–Sat · 9:00 – 20:00</li>
            <li>
              💬{" "}
              <a
                className="underline decoration-brand-honey underline-offset-4 hover:text-brand-honey"
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                0891 3929 25 (WhatsApp only)
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-brand-honey">Quick Bites</h3>
          <ul className="mt-3 space-y-2 text-brand-white/80">
            <li><Link className="hover:text-brand-honey" href="/menu">Menu</Link></li>
            <li><Link className="hover:text-brand-honey" href="/about">Our Story</Link></li>
            <li><Link className="hover:text-brand-honey" href="/gallery">Gallery</Link></li>
            <li><Link className="hover:text-brand-honey" href="/account">My Orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-white/10 py-4 text-center text-sm text-brand-white/50">
        © {new Date().getFullYear()} Zingwangwa Street Foods · Made with 🔥 in Blantyre
      </div>
    </footer>
  );
}
