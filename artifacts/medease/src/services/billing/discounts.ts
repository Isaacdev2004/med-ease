export function applyDiscountCode(subtotal: number, code: string) {
  const codes: Record<string, number> = { WELCOME10: 0.1, STAFF15: 0.15, SENIOR20: 0.2 };
  const rate = codes[code.toUpperCase()] ?? 0;
  return { code, discountAmount: Math.round(subtotal * rate), discountRate: rate };
}
