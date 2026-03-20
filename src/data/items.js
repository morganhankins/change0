import { CUSTOMERS } from './customers'

/**
 * Shop items organized by difficulty level.
 *
 * Level 1: Prices 10–99 cents (rounded to 5¢) — coins only
 * Level 2: Prices $1.05–$4.95 — bills and coins
 * Level 3: Prices 15–95 cents — used to calculate change from $1.00
 */
const ITEMS = [
  // Level 1 — coins only, under $1
  { name: 'Apple',      emoji: '🍎', priceCents: 47,  level: 1 },
  { name: 'Cookie',     emoji: '🍪', priceCents: 35,  level: 1 },
  { name: 'Banana',     emoji: '🍌', priceCents: 52,  level: 1 },
  { name: 'Juice Box',  emoji: '🧃', priceCents: 85,  level: 1 },
  { name: 'Lollipop',   emoji: '🍭', priceCents: 25,  level: 1 },
  { name: 'Gum',        emoji: '🍬', priceCents: 15,  level: 1 },
  { name: 'Pretzel',    emoji: '🥨', priceCents: 60,  level: 1 },
  { name: 'Sticker',    emoji: '⭐', priceCents: 10,  level: 1 },

  // Level 2 — bills and coins, $1.05–$4.95
  { name: 'Pizza Slice', emoji: '🍕', priceCents: 175, level: 2 },
  { name: 'Hot Dog',     emoji: '🌭', priceCents: 135, level: 2 },
  { name: 'Ice Cream',   emoji: '🍦', priceCents: 250, level: 2 },
  { name: 'Sandwich',    emoji: '🥪', priceCents: 395, level: 2 },
  { name: 'Cupcake',     emoji: '🧁', priceCents: 165, level: 2 },
  { name: 'Lemonade',    emoji: '🍋', priceCents: 125, level: 2 },
  { name: 'Taco',        emoji: '🌮', priceCents: 285, level: 2 },
  { name: 'Donut',       emoji: '🍩', priceCents: 110, level: 2 },

  // Level 3 — make exact change from $1.00, prices 15–95 cents
  { name: 'Marble',     emoji: '🔮', priceCents: 15,  level: 3 },
  { name: 'Eraser',     emoji: '✏️', priceCents: 25,  level: 3 },
  { name: 'Pencil',     emoji: '📝', priceCents: 35,  level: 3 },
  { name: 'Bookmark',   emoji: '🔖', priceCents: 45,  level: 3 },
  { name: 'Button',     emoji: '🪡', priceCents: 55,  level: 3 },
  { name: 'Key Chain',  emoji: '🗝️', priceCents: 65,  level: 3 },
  { name: 'Badge',      emoji: '🏅', priceCents: 75,  level: 3 },
  { name: 'Ribbon',     emoji: '🎀', priceCents: 85,  level: 3 },
]

/**
 * Returns a random item for the given difficulty level.
 * @param {1|2|3} level
 * @returns {{ name: string, emoji: string, priceCents: number, level: number }}
 */
export function getRandomItem(level) {
  const pool = ITEMS.filter(item => item.level === level)
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Returns a random customer, excluding the one with excludeId to avoid repeats.
 * @param {Array} customers - Array of customer objects
 * @param {string|null} excludeId - ID of the customer to exclude
 * @returns {{ id: string, emoji: string, name: string, color: string }}
 */
export function getRandomCustomer(customers, excludeId) {
  const available = customers.filter(c => c.id !== excludeId)
  return available[Math.floor(Math.random() * available.length)]
}

export default ITEMS
