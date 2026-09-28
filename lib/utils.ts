import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format whole-kwacha amounts like "K 4,500". */
export function formatKwacha(amount: number): string {
  return `K ${Math.round(amount).toLocaleString("en-ZM")}`;
}

/** Shimmer blur placeholder — honey gradient for Next/Image `blurDataURL`. */
export function shimmerBlur(w = 700, h = 500): string {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C2B00"/><stop offset="0.5" stop-color="#BF4C00"/><stop offset="1" stop-color="#FFBE00"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
