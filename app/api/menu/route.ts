import { NextResponse } from "next/server";
import { getCategories, getMenuItems } from "@/lib/menu-queries";

/** Menu is semi-static — ISR-style caching with a 60s revalidate. */
export const revalidate = 60;

/** GET /api/menu → { categories, items } (Supabase, or bundled seed data in demo mode). */
export async function GET() {
  const [categories, items] = await Promise.all([getCategories(), getMenuItems()]);
  return NextResponse.json({ categories, items });
}
