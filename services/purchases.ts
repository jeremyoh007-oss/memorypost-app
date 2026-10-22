/**
 * Purchase service boundary. MOCK ONLY for now: nothing is charged.
 * Swap `purchases` for a RevenueCat-backed implementation later (react-native-purchases),
 * keeping this interface so screens do not change.
 */
export type Product = { id: string; title: string; priceLabel: string };

export type PurchaseResult =
  | { ok: true; productId: string }
  | { ok: false; reason: 'cancelled' | 'unavailable' | 'error' };

export interface PurchaseService {
  readonly isMock: boolean;
  getProducts(ids: string[]): Promise<Product[]>;
  purchase(productId: string): Promise<PurchaseResult>;
  /** Returns product ids the user already owns. */
  restore(): Promise<string[]>;
}

const CATALOG: Record<string, Product> = {
  friend_lion: { id: 'friend_lion', title: '사자', priceLabel: '₩4,400' },
  friend_penguin_winter: { id: 'friend_penguin_winter', title: '펭귄 (겨울 한정판)', priceLabel: '₩4,400' },
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockPurchases implements PurchaseService {
  readonly isMock = true;
  private owned = new Set<string>();

  async getProducts(ids: string[]) {
    return ids.map((id) => CATALOG[id]).filter((p): p is Product => !!p);
  }

  async purchase(productId: string): Promise<PurchaseResult> {
    if (!CATALOG[productId]) return { ok: false, reason: 'unavailable' };
    await wait(900); // "결제 중…"
    this.owned.add(productId);
    return { ok: true, productId };
  }

  async restore() {
    return [...this.owned];
  }
}

export const purchases: PurchaseService = new MockPurchases();
