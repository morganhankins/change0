/**
 * Money utility functions for the Change! game.
 * All internal values are integer cents to avoid floating-point drift.
 */

/**
 * Converts a dollar float to integer cents.
 * @param {number} dollars - Dollar amount (e.g. 0.47)
 * @returns {number} Integer cents (e.g. 47)
 */
export function toCents(dollars) {
  return Math.round(dollars * 100)
}

/**
 * Converts integer cents to a display string.
 * Under 100 cents: "47¢"
 * 100+ cents: "$1.25"
 * @param {number} cents - Integer cents (e.g. 47)
 * @returns {string} Formatted string (e.g. "47¢" or "$1.25")
 */
export function toDollars(cents) {
  if (cents < 100) {
    return `${cents}¢`
  }
  const dollars = Math.floor(cents / 100)
  const remainingCents = cents % 100
  return `$${dollars}.${String(remainingCents).padStart(2, '0')}`
}

/**
 * Always formats cents as "$X.XX" regardless of amount.
 * Used for displaying item prices.
 * @param {number} cents - Integer cents (e.g. 47)
 * @returns {string} Dollar-formatted string (e.g. "$0.47")
 */
export function toDisplayDollars(cents) {
  const dollars = Math.floor(cents / 100)
  const remainingCents = cents % 100
  return `$${dollars}.${String(remainingCents).padStart(2, '0')}`
}

/**
 * Calculates the difference between coins dropped and the item price.
 * @param {number} itemPriceCents - Price in integer cents
 * @param {Array<{valueCents: number}>} coinsArray - Array of coin objects
 * @returns {number} Difference in cents (negative = underpay, 0 = exact, positive = overpay)
 */
export function calculateChange(itemPriceCents, coinsArray) {
  const totalCoins = coinsArray.reduce((sum, coin) => sum + coin.valueCents, 0)
  return totalCoins - itemPriceCents
}

/**
 * Available coin and bill denominations.
 * @type {Array<{id: string, label: string, valueCents: number, display: string}>}
 */
export const COIN_DENOMINATIONS = [
  { id: 'penny',   label: 'Penny',         valueCents: 1,   display: '1¢'  },
  { id: 'nickel',  label: 'Nickel',        valueCents: 5,   display: '5¢'  },
  { id: 'dime',    label: 'Dime',          valueCents: 10,  display: '10¢' },
  { id: 'quarter', label: 'Quarter',       valueCents: 25,  display: '25¢' },
  { id: 'dollar',  label: 'Dollar Bill',   valueCents: 100, display: '$1'  },
  { id: 'five',    label: 'Five Dollar',   valueCents: 500, display: '$5'  },
]
