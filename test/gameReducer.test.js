import { describe, it, expect } from 'vitest'
import { gameReducer, initialState } from '../src/store/gameReducer'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MOCK_CUSTOMER = { id: 'rex', emoji: '🐶', name: 'Rex', color: '#DC6B4A' }
const MOCK_ITEM     = { name: 'Apple', emoji: '🍎', priceCents: 47, level: 1 }

/** Advance state to 'playing' with a round in progress. */
function playingState(overrides = {}) {
  const afterLevel = gameReducer(initialState, { type: 'SET_LEVEL', payload: 1 })
  const afterRound = gameReducer(afterLevel, {
    type: 'START_ROUND',
    payload: { customer: MOCK_CUSTOMER, item: MOCK_ITEM },
  })
  return { ...afterRound, ...overrides }
}

/** Add coins to the register to reach exactly targetCents. */
function addExactCoins(state, cents) {
  return gameReducer(state, {
    type: 'DROP_COIN',
    payload: { uid: 'coin-exact', denominationId: 'quarter', valueCents: cents },
  })
}

// ---------------------------------------------------------------------------
// SET_LEVEL
// ---------------------------------------------------------------------------
describe('SET_LEVEL', () => {
  it('sets the level and transitions to playing screen', () => {
    const next = gameReducer(initialState, { type: 'SET_LEVEL', payload: 2 })
    expect(next.screen).toBe('playing')
    expect(next.level).toBe(2)
  })

  it('resets all progress fields when setting a new level', () => {
    const next = gameReducer(initialState, { type: 'SET_LEVEL', payload: 1 })
    expect(next.correctCount).toBe(0)
    expect(next.currentRound).toBe(0)
    expect(next.roundResults).toEqual([])
    expect(next.coinsInRegister).toEqual([])
  })

  it('accepts level 3', () => {
    const next = gameReducer(initialState, { type: 'SET_LEVEL', payload: 3 })
    expect(next.level).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// START_ROUND
// ---------------------------------------------------------------------------
describe('START_ROUND', () => {
  it('sets the customer and item', () => {
    const state = playingState()
    expect(state.customer).toEqual(MOCK_CUSTOMER)
    expect(state.item).toEqual(MOCK_ITEM)
  })

  it('clears the coin register', () => {
    // First add a coin, then start a new round
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'c1', denominationId: 'quarter', valueCents: 25 },
    })
    expect(state.coinsInRegister).toHaveLength(1)

    state = gameReducer(state, {
      type: 'START_ROUND',
      payload: { customer: MOCK_CUSTOMER, item: MOCK_ITEM },
    })
    expect(state.coinsInRegister).toHaveLength(0)
  })

  it('increments currentRound', () => {
    const state = playingState()
    expect(state.currentRound).toBe(1)
  })

  it('resets submitAttempts to 0', () => {
    const state = playingState({ submitAttempts: 3 })
    const next = gameReducer(state, {
      type: 'START_ROUND',
      payload: { customer: MOCK_CUSTOMER, item: MOCK_ITEM },
    })
    expect(next.submitAttempts).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// DROP_COIN
// ---------------------------------------------------------------------------
describe('DROP_COIN', () => {
  it('adds a coin to the register', () => {
    const state = playingState()
    const next = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'coin-1', denominationId: 'quarter', valueCents: 25 },
    })
    expect(next.coinsInRegister).toHaveLength(1)
    expect(next.coinsInRegister[0]).toEqual({
      uid: 'coin-1',
      denominationId: 'quarter',
      valueCents: 25,
    })
  })

  it('does NOT add a coin with a duplicate uid (critical double-count guard)', () => {
    const state = playingState()
    const afterFirst = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'coin-dup', denominationId: 'dime', valueCents: 10 },
    })
    const afterSecond = gameReducer(afterFirst, {
      type: 'DROP_COIN',
      payload: { uid: 'coin-dup', denominationId: 'dime', valueCents: 10 },
    })
    expect(afterSecond.coinsInRegister).toHaveLength(1)
  })

  it('allows multiple coins with different uids', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'a', denominationId: 'penny', valueCents: 1 },
    })
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'b', denominationId: 'nickel', valueCents: 5 },
    })
    expect(state.coinsInRegister).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// REMOVE_COIN
// ---------------------------------------------------------------------------
describe('REMOVE_COIN', () => {
  it('removes the coin with the matching uid', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'coin-x', denominationId: 'quarter', valueCents: 25 },
    })
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'coin-y', denominationId: 'dime', valueCents: 10 },
    })
    const next = gameReducer(state, { type: 'REMOVE_COIN', payload: 'coin-x' })
    expect(next.coinsInRegister).toHaveLength(1)
    expect(next.coinsInRegister[0].uid).toBe('coin-y')
  })

  it('leaves register unchanged if uid does not exist', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'coin-z', denominationId: 'penny', valueCents: 1 },
    })
    const next = gameReducer(state, { type: 'REMOVE_COIN', payload: 'nonexistent' })
    expect(next.coinsInRegister).toHaveLength(1)
  })
})

// ---------------------------------------------------------------------------
// SUBMIT — exact amount (correct)
// ---------------------------------------------------------------------------
describe('SUBMIT with exact amount', () => {
  it('sets lastSubmitResult to "correct"', () => {
    let state = playingState() // item.priceCents = 47
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'exact', denominationId: 'quarter', valueCents: 47 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.lastSubmitResult).toBe('correct')
  })

  it('increments correctCount', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'exact', denominationId: 'quarter', valueCents: 47 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.correctCount).toBe(1)
  })

  it('appends to roundResults with correct: true', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'exact', denominationId: 'quarter', valueCents: 47 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.roundResults).toHaveLength(1)
    expect(next.roundResults[0].correct).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// SUBMIT — underpay
// ---------------------------------------------------------------------------
describe('SUBMIT with underpay', () => {
  it('increments submitAttempts', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'low', denominationId: 'penny', valueCents: 10 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.submitAttempts).toBe(1)
  })

  it('sets lastSubmitResult to "underpay"', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'low', denominationId: 'penny', valueCents: 10 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.lastSubmitResult).toBe('underpay')
  })

  it('keeps coins in the register after underpay', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'low', denominationId: 'penny', valueCents: 10 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.coinsInRegister).toHaveLength(1)
  })

  it('does NOT add to roundResults on underpay', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'low', denominationId: 'penny', valueCents: 10 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.roundResults).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// SUBMIT — overpay
// ---------------------------------------------------------------------------
describe('SUBMIT with overpay', () => {
  it('sets overpayAnimating to true', () => {
    let state = playingState() // price = 47¢
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'big', denominationId: 'dollar', valueCents: 100 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.overpayAnimating).toBe(true)
  })

  it('sets lastSubmitResult to "overpay"', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'big', denominationId: 'dollar', valueCents: 100 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.lastSubmitResult).toBe('overpay')
  })

  it('increments submitAttempts', () => {
    let state = playingState()
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'big', denominationId: 'dollar', valueCents: 100 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.submitAttempts).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// OVERPAY_DONE
// ---------------------------------------------------------------------------
describe('OVERPAY_DONE', () => {
  it('clears overpayAnimating flag', () => {
    const state = { ...initialState, overpayAnimating: true }
    const next = gameReducer(state, { type: 'OVERPAY_DONE' })
    expect(next.overpayAnimating).toBe(false)
  })

  it('clears lastSubmitResult', () => {
    const state = { ...initialState, overpayAnimating: true, lastSubmitResult: 'overpay' }
    const next = gameReducer(state, { type: 'OVERPAY_DONE' })
    expect(next.lastSubmitResult).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// NEXT_ROUND
// ---------------------------------------------------------------------------
describe('NEXT_ROUND', () => {
  it('stays on playing screen when there are more rounds', () => {
    const state = { ...playingState(), currentRound: 3, rounds: 5 }
    const next = gameReducer(state, { type: 'NEXT_ROUND' })
    expect(next.screen).toBe('playing')
  })

  it('transitions to summary after the last round', () => {
    const state = { ...playingState(), currentRound: 5, rounds: 5 }
    const next = gameReducer(state, { type: 'NEXT_ROUND' })
    expect(next.screen).toBe('summary')
  })

  it('clears the register when advancing to next round', () => {
    let state = { ...playingState(), currentRound: 2, rounds: 5 }
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'c1', denominationId: 'quarter', valueCents: 25 },
    })
    const next = gameReducer(state, { type: 'NEXT_ROUND' })
    expect(next.coinsInRegister).toHaveLength(0)
  })

  it('preserves correctCount when advancing', () => {
    const state = { ...playingState(), currentRound: 2, rounds: 5, correctCount: 2 }
    const next = gameReducer(state, { type: 'NEXT_ROUND' })
    expect(next.correctCount).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// RESTART
// ---------------------------------------------------------------------------
describe('RESTART', () => {
  it('resets screen to difficulty', () => {
    const state = { ...initialState, screen: 'summary', correctCount: 5 }
    const next = gameReducer(state, { type: 'RESTART' })
    expect(next.screen).toBe('difficulty')
  })

  it('resets all fields to initial values', () => {
    const state = {
      ...initialState,
      screen: 'summary',
      level: 3,
      correctCount: 5,
      currentRound: 5,
      roundResults: [{ correct: true, attempts: 1 }],
    }
    const next = gameReducer(state, { type: 'RESTART' })
    expect(next).toEqual(initialState)
  })
})

// ---------------------------------------------------------------------------
// Level 3 target calculation (change from $1.00)
// ---------------------------------------------------------------------------
describe('Level 3 SUBMIT logic', () => {
  it('treats target as 100 - item.priceCents for level 3', () => {
    // Item costs 35¢; change from $1 = 65¢
    const item = { name: 'Eraser', emoji: '✏️', priceCents: 35, level: 3 }
    let state = {
      ...initialState,
      screen: 'playing',
      level: 3,
      customer: MOCK_CUSTOMER,
      item,
      coinsInRegister: [],
      currentRound: 1,
      submitAttempts: 0,
      roundResults: [],
    }
    // Drop 65¢ — should be correct
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'c1', denominationId: 'quarter', valueCents: 65 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.lastSubmitResult).toBe('correct')
  })

  it('underpays on level 3 when coins total less than change amount', () => {
    const item = { name: 'Eraser', emoji: '✏️', priceCents: 35, level: 3 }
    let state = {
      ...initialState,
      screen: 'playing',
      level: 3,
      customer: MOCK_CUSTOMER,
      item,
      coinsInRegister: [],
      currentRound: 1,
      submitAttempts: 0,
      roundResults: [],
    }
    state = gameReducer(state, {
      type: 'DROP_COIN',
      payload: { uid: 'c1', denominationId: 'quarter', valueCents: 25 },
    })
    const next = gameReducer(state, { type: 'SUBMIT' })
    expect(next.lastSubmitResult).toBe('underpay')
  })
})
