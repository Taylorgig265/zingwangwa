/** Shared domain types for Zingwangwa Street Foods. */

export type SpiceLevel = "none" | "mild" | "medium" | "hot" | "zing";

export type OrderStatus = "received" | "cooking" | "ready" | "delivered" | "cancelled";

export type PaymentMethod = "pawapay" | "cod";

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  icon: string | null;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  /** Price in Malawian Kwacha (whole units). */
  price_zmw: number;
  image_url: string | null;
  tags: string[];
  is_available: boolean;
  is_featured: boolean;
  spice_level: SpiceLevel;
  prep_time_mins: number;
  created_at?: string;
  /** Joined at query time. */
  categories?: { name: string; slug: string } | null;
}

export interface CartLine {
  item: MenuItem;
  qty: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_address: string | null;
  phone: string;
  notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  qty: number;
  unit_price: number;
  name_snapshot: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  menu_item_id: string;
  created_at: string;
  menu_items?: MenuItem;
}
