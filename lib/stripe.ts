/**
 * Payment gateway initializer.
 * 
 * In production this would initialize the Pawapay SDK:
 *   const pawapay = new Pawapay(process.env.PAWAPAY_SECRET_KEY);
 * 
 * For now, the app runs in demo mode without a gateway key —
 * orders are written directly via Supabase (COD path) or the
 * /api/pawapay/checkout endpoint creates a Pawapay-hosted session.
 * 
 * Throws only when actually used without keys, so the app still
 * builds/boots in demo mode without env vars.
 */
let gateway: any = null;

export function getGateway() {
  const key = process.env.PAWAPAY_SECRET_KEY;
  if (!key) throw new Error("PAWAPAY_SECRET_KEY is not configured.");
  if (!gateway) gateway = { key };
  return gateway;
}

export const PAWAPAY_CURRENCY = "zmw";