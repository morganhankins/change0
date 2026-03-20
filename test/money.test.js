import { describe, it, expect } from 'vitest'
import {
  toCents,
  toDollars,
  toDisplayDollars,
  calculateChange,
  COIN_DENOMINATIONS,
} from '../src/utils/money'

// ---------------------------------------------------------------------------
// toCents
// ---------------------------------------------------------------------------
describe('toCents', () => {
  it('converts a simple float dollar amount to cents', () => {
    expect(toCents(0.47)).toBe(47)
  })

  it('converts $1.25 to 125 cents', () => {
    expect(toCents(1.25)).toBe(125)
  })

  it('converts $0.00 to 0 cents', () => {
    expect(toCents(0)).toBe(0)
  })

  it('converts whole dollars', () => {
    expect(toCents(5)).toBe(500)
  })

  it('rounds to avoid float drift (e.g. 0.1 + 0.2 hazard)', () => {
    // 0.1 + 0.2 = 0.30000000000000004 in JS; toCents should yield 30
    expect(toCents(0.1 + 0.2)).toBe(30)
  })

  it('converts $4.99 to 499 cents', () => {
    expect(toCents(4.99)).toBe(499)
  })
})

// ---------------------------------------------------------------------------
// toDollars
// ---------------------------------------------------------------------------
describe('toDollars', () => {
  it('shows cents-only format for values under 100', () => {
    expect(toDollars(47)).toBe('47¢')
  })

  it('shows 0¢ for zero cents', () => {
    expect(toDollars(0)).toBe('0¢')
  })

  it('shows $1.00 for exactly 100 cents', () => {
    expect(toDollars(100)).toBe('$1.00')
  })

  it('shows $1.25 for 125 cents', () => {
    expect(toDollars(125)).toBe('$1.25')
  })

  it('pads cents to two digits: $1.05', () => {
    expect(toDollars(105)).toBe('$1.05')
  })

  it('shows $5.00 for 500 cents', () => {
    expect(toDollars(500)).toBe('$5.00')
  })

  it('shows 99¢ for 99 cents', () => {
    expect(toDollars(99)).toBe('99¢')
  })

  it('shows $2.75 for 275 cents', () => {
    expect(toDollars(275)).toBe('$2.75')
  })
})

// ---------------------------------------------------------------------------
// toDisplayDollars
// ---------------------------------------------------------------------------
describe('toDisplayDollars', () => {
  it('always shows $X.XX format even for amounts under $1', () => {
    expect(toDisplayDollars(47)).toBe('$0.47')
  })

  it('shows $1.25 for 125 cents', () => {
    expect(toDisplayDollars(125)).toBe('$1.25')
  })

  it('shows $0.00 for zero', () => {
    expect(toDisplayDollars(0)).toBe('$0.00')
  })

  it('pads single-digit cents: $1.05', () => {
    expect(toDisplayDollars(105)).toBe('$1.05')
  })
})

// ---------------------------------------------------------------------------
// calculateChange
// ---------------------------------------------------------------------------
describe('calculateChange', () => {
  it('returns 0 when coins exactly match the price', () => {
    const coins = [{ valueCents: 25 }, { valueCents: 25 }, { valueCents: 10 }, { valueCents: 10 }]
    expect(calculateChange(70, coins)).toBe(0)
  })

  it('returns negative when coins are less than the price (underpay)', () => {
    const coins = [{ valueCents: 25 }]
    expect(calculateChange(47, coins)).toBe(-22)
  })

  it('returns positive when coins exceed the price (overpay)', () => {
    const coins = [{ valueCents: 100 }]
    expect(calculateChange(47, coins)).toBe(53)
  })

  it('returns negative price when array is empty', () => {
    expect(calculateChange(35, [])).toBe(-35)
  })

  it('handles a mix of denominations for exact change', () => {
    // 1 quarter + 2 dimes + 2 pennies = 47¢
    const coins = [
      { valueCents: 25 },
      { valueCents: 10 },
      { valueCents: 10 },
      { valueCents: 1 },
      { valueCents: 1 },
    ]
    expect(calculateChange(47, coins)).toBe(0)
  })

  it('handles large amounts with bills', () => {
    // $1 bill + quarter = $1.25, price = $1.00 → overpay by 25¢
    const coins = [{ valueCents: 100 }, { valueCents: 25 }]
    expect(calculateChange(100, coins)).toBe(25)
  })

  it('works with a $5 bill and price $4.95 → overpay 5¢', () => {
    const coins = [{ valueCents: 500 }]
    expect(calculateChange(495, coins)).toBe(5)
  })
})

// ---------------------------------------------------------------------------
// COIN_DENOMINATIONS
// ---------------------------------------------------------------------------
describe('COIN_DENOMINATIONS', () => {
  it('exports an array of 6 denominations', () => {
    expect(COIN_DENOMINATIONS).toHaveLength(6)
  })

  it('includes penny with valueCents 1', () => {
    const penny = COIN_DENOMINATIONS.find(d => d.id === 'penny')
    expect(penny).toBeDefined()
    expect(penny.valueCents).toBe(1)
  })

  it('includes quarter with valueCents 25', () => {
    const quarter = COIN_DENOMINATIONS.find(d => d.id === 'quarter')
    expect(quarter).toBeDefined()
    expect(quarter.valueCents).toBe(25)
  })

  it('includes dollar bill with valueCents 100', () => {
    const dollar = COIN_DENOMINATIONS.find(d => d.id === 'dollar')
    expect(dollar).toBeDefined()
    expect(dollar.valueCents).toBe(100)
  })

  it('includes five-dollar bill with valueCents 500', () => {
    const five = COIN_DENOMINATIONS.find(d => d.id === 'five')
    expect(five).toBeDefined()
    expect(five.valueCents).toBe(500)
  })

  it('every denomination has id, label, valueCents, and display fields', () => {
    for (const denom of COIN_DENOMINATIONS) {
      expect(denom).toHaveProperty('id')
      expect(denom).toHaveProperty('label')
      expect(denom).toHaveProperty('valueCents')
      expect(denom).toHaveProperty('display')
      expect(typeof denom.valueCents).toBe('number')
      expect(Number.isInteger(denom.valueCents)).toBe(true)
    }
  })
})
