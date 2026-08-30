import { CartItem, OrderDetails } from '../types';

// Same free Supabase project ("indian-flavors") already used by the
// reservation form on indianflavors.pages.dev. The key below is Supabase's
// new "publishable" key (their renamed anon key) — safe to ship in
// client-side code by design: the `orders` table's row-level-security
// policy only allows this key to INSERT, never read/update/delete other
// people's orders.
const SUPABASE_URL = 'https://zzdiibzoalmymgbztepf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_96be9YWDCuHOD9-rmGVkeg_5RTW8Jx7';

interface SyncableOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  riceOption?: string;
}

/**
 * Sends the order to the in-restaurant staff screen (Supabase `orders`
 * table, picked up there in real time). This is purely a "nice to have"
 * side channel — it must NEVER block or break the existing WhatsApp
 * ordering flow, which stays the source of truth for the customer.
 * Any failure here (network, Supabase down, etc.) is swallowed silently.
 */
export function syncOrderToScreen(
  cart: CartItem[],
  orderDetails: OrderDetails,
  cartTotal: number
): void {
  try {
    const items: SyncableOrderItem[] = cart.map((item) => {
      const unitPrice = item.menuItem.price + (item.selectedRice ? item.selectedRice.price : 0);
      return {
        name: item.menuItem.nameFr,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        ...(item.selectedRice ? { riceOption: item.selectedRice.nameFr } : {}),
      };
    });

    const payload = {
      order_type: orderDetails.orderType,
      customer_name: orderDetails.customerName || null,
      customer_phone: orderDetails.customerPhone || null,
      address_or_table: orderDetails.addressOrTable || null,
      special_notes: orderDetails.specialNotes || null,
      items,
      total: cartTotal,
    };

    // Fire-and-forget: we intentionally don't await this, so a slow or
    // failed request can never delay opening WhatsApp for the customer.
    fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      // Screen sync is best-effort only — never surface this to the customer.
      console.error('orderSync: failed to push order to staff screen', err);
    });
  } catch (err) {
    console.error('orderSync: unexpected error building order payload', err);
  }
}
