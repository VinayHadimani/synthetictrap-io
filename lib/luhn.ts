/**
 * Luhn-valid synthetic card generator.
 *
 * Generates 16-digit numbers that pass the Luhn checksum (so any merchant's
 * client-side validator accepts them) but use the publicly-known Visa test BIN
 * 400000 — they are NOT real cards and will never authorize.
 *
 * Why this exists: attackers who breach our DB will use these cards on
 * real merchant sites. Their validation passes. Their payment fails. But the
 * attempt itself triggers our /api/trap alert first.
 */

const TEST_BIN = "400000"; // Visa test prefix — publicly known, not a real issuing bank

/**
 * Compute the Luhn check digit for a numeric string.
 * Exported so it can be reused / tested independently.
 */
export function computeLuhnCheckDigit(partial: string): number {
  let sum = 0;
  let alt = true;
  for (let i = partial.length - 1; i >= 0; i--) {
    let n = parseInt(partial[i], 10);
    if (Number.isNaN(n)) throw new Error("Non-numeric input to Luhn");
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Generate a 16-digit Luhn-valid card number.
 * Format: 400000 + 9 random digits + 1 Luhn check digit.
 */
export function generateLuhnCard(): string {
  let card = TEST_BIN;
  for (let i = 0; i < 9; i++) {
    card += Math.floor(Math.random() * 10).toString();
  }
  return card + computeLuhnCheckDigit(card).toString();
}

/**
 * Verify a card passes the Luhn checksum.
 * Used both for self-tests and to reject bad data at write time.
 */
export function luhnCheck(card: string): boolean {
  if (!/^\d+$/.test(card)) return false;
  let sum = 0;
  let alt = false;
  for (let i = card.length - 1; i >= 0; i--) {
    let n = parseInt(card[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** 3-digit CVV. */
export function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

/** MM/YY expiry, valid for 2-5 years out (2028-2031). */
export function generateExpiry(): string {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const year = String(28 + Math.floor(Math.random() * 4));
  return `${month}/${year}`;
}

// ----- Self-test: run with `npx tsx lib/luhn.ts` -----
if (process.argv[1]?.endsWith("luhn.ts")) {
  let failures = 0;
  for (let i = 0; i < 20; i++) {
    const card = generateLuhnCard();
    const ok = luhnCheck(card);
    if (!ok) failures++;
    if (!card.startsWith(TEST_BIN) || card.length !== 16) {
      console.error("Bad format:", card);
      failures++;
    }
  }
  // Also verify a known Luhn-invalid number fails
  if (luhnCheck("4000000000000001")) {
    console.error("Known-invalid card passed Luhn!");
    failures++;
  }
  if (failures === 0) {
    console.log("✅ Luhn generator: 20/20 valid, format correct, invalid-card check works.");
    process.exit(0);
  } else {
    console.error(`❌ ${failures} failure(s).`);
    process.exit(1);
  }
}
