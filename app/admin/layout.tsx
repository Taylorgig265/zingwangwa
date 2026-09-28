import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin" };

/**
 * Admin shell — server-side role gate. RLS still enforces is_admin on every write,
 * this just keeps the UI honest (and curious customers out).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return (
      <Gate title="Demo mode 🍟" message="Connect Supabase env vars to unlock the admin kitchen.">
        <Link href="/"><Button variant="honey">Back to the stall</Button></Link>
      </Gate>
    );
  }

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return (
      <Gate title="Staff only 🔐" message="Log in with an admin account to run the kitchen.">
        <Link href="/login?next=/admin"><Button variant="honey">Log in</Button></Link>
      </Gate>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", auth.user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <Gate title="No apron, no entry 😅" message={`${auth.user.email} isn't on the staff list.`}>
        <Link href="/"><Button variant="honey">Back to the stall</Button></Link>
      </Gate>
    );
  }

  return (
    <div className="min-h-screen bg-brand-white">
      <header className="sticky top-0 z-40 border-b-2 border-brand-honey/40 bg-brand-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" aria-label="Admin home">
            <Logo compact />
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold text-brand-cacao">
            <NavLink href="/admin" label="Dashboard" />
            <NavLink href="/admin/orders" label="Orders" />
            <NavLink href="/admin/menu" label="Menu" />
            <Link href="/" className="ml-2 text-brand-burnt hover:underline">→ Stall</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-full px-3 py-1.5 transition-colors hover:bg-brand-honey/20 hover:text-brand-burnt">
      {label}
    </Link>
  );
}

function Gate({ title, message, children }: { title: string; message: string; children: React.ReactNode }) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Logo compact />
      <h1 className="font-display text-4xl text-brand-cacao">{title}</h1>
      <p className="max-w-sm text-brand-cacao/70">{message}</p>
      {children}
    </section>
  );
}
