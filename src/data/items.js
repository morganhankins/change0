/**
 * Generates a random price in [minCents, maxCents].
 * 75% of the time snaps to a multiple of 5 (round amount).
 * 25% of the time picks any cent value in range.
 */
function randomPrice(minCents, maxCents) {
  if (Math.random() < 0.75) {
    const minRound = Math.ceil(minCents / 5) * 5
    const maxRound = Math.floor(maxCents / 5) * 5
    const steps = (maxRound - minRound) / 5
    return minRound + Math.floor(Math.random() * (steps + 1)) * 5
  }
  return minCents + Math.floor(Math.random() * (maxCents - minCents + 1))
}

/**
 * Shop items: name + emoji only. Prices are generated fresh each round
 * by getRandomItem() so amounts vary across playthroughs.
 */
const ITEMS = [
  // Levels 1/0 — coins only, under $1
  { name: 'Apple',      emoji: '🍎', level: 1 },
  { name: 'Cookie',     emoji: '🍪', level: 1 },
  { name: 'Banana',     emoji: '🍌', level: 1 },
  { name: 'Juice Box',  emoji: '🧃', level: 1 },
  { name: 'Lollipop',   emoji: '🍭', level: 1 },
  { name: 'Gum',        emoji: '🍬', level: 1 },
  { name: 'Pretzel',    emoji: '🥨', level: 1 },
  { name: 'Sticker',    emoji: '⭐', level: 1 },

  // Level 2 — bills and coins, $1.05–$4.95
  { name: 'Pizza Slice', emoji: '🍕', level: 2 },
  { name: 'Hot Dog',     emoji: '🌭', level: 2 },
  { name: 'Ice Cream',   emoji: '🍦', level: 2 },
  { name: 'Sandwich',    emoji: '🥪', level: 2 },
  { name: 'Cupcake',     emoji: '🧁', level: 2 },
  { name: 'Lemonade',    emoji: '🍋', level: 2 },
  { name: 'Taco',        emoji: '🌮', level: 2 },
  { name: 'Donut',       emoji: '🍩', level: 2 },

  // Level 3 — make exact change from $1.00
  { name: 'Marble',    emoji: '🔮', level: 3 },
  { name: 'Eraser',    emoji: '✏️', level: 3 },
  { name: 'Pencil',    emoji: '📝', level: 3 },
  { name: 'Bookmark',  emoji: '🔖', level: 3 },
  { name: 'Button',    emoji: '🪡', level: 3 },
  { name: 'Key Chain', emoji: '🗝️', level: 3 },
  { name: 'Badge',     emoji: '🏅', level: 3 },
  { name: 'Ribbon',    emoji: '🎀', level: 3 },
]

/** Price ranges per level [minCents, maxCents] */
const PRICE_RANGE = {
  1: [10, 95],
  2: [105, 495],
  3: [15, 85],
}

/**
 * Returns a random item with a freshly generated price for the given level.
 * Level 0 (Easy Peasy) uses level 1 items and price range.
 */
export function getRandomItem(level) {
  const effectiveLevel = level === 0 ? 1 : level
  const pool = ITEMS.filter(item => item.level === effectiveLevel)
  const item = pool[Math.floor(Math.random() * pool.length)]
  const [min, max] = PRICE_RANGE[effectiveLevel]
  return { ...item, priceCents: randomPrice(min, max) }
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
