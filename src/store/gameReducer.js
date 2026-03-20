/**
 * Game State Machine
 * ==================
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │                     difficulty                              │
 *   │  (initial screen — player picks a level)                    │
 *   └─────────────────┬───────────────────────────────────────────┘
 *                     │ SET_LEVEL
 *                     ▼
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │                      playing                                │
 *   │                                                             │
 *   │  START_ROUND ──► customer + item set, register cleared      │
 *   │                                                             │
 *   │  DROP_COIN ────► coin added if uid not already present      │
 *   │  REMOVE_COIN ──► coin removed by uid                        │
 *   │                                                             │
 *   │  SUBMIT ──► correct  ──► roundResults updated               │
 *   │         └─► overpay  ──► overpayAnimating = true            │
 *   │         └─► underpay ──► submitAttempts++                   │
 *   │                                                             │
 *   │  OVERPAY_DONE ─► overpayAnimating = false                   │
 *   │                                                             │
 *   │  NEXT_ROUND ──► if more rounds: START next round            │
 *   │             └─► if last round: ──────────────────────────┐  │
 *   └──────────────────────────────────────────────────────────┼──┘
 *                                                              │
 *                     ┌─────────────────────────────────────── ▼ ─┐
 *                     │                  summary                   │
 *                     │  (shows results — player can restart)      │
 *                     └───────────────────┬───────────────────────┘
 *                                         │ RESTART
 *                                         ▼
 *                                    difficulty
 */

export const initialState = {
  screen: 'difficulty',
  level: 1,
  rounds: 5,
  currentRound: 0,
  correctCount: 0,
  customer: null,
  item: null,
  coinsInRegister: [],
  submitAttempts: 0,
  roundResults: [],
  overpayAnimating: false,
  lastSubmitResult: null, // 'correct' | 'underpay' | 'overpay' | null
}

/**
 * @param {typeof initialState} state
 * @param {{ type: string, payload?: any }} action
 * @returns {typeof initialState}
 */
export function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LEVEL': {
      return {
        ...initialState,
        screen: 'playing',
        level: action.payload,
      }
    }

    case 'START_ROUND': {
      return {
        ...state,
        customer: action.payload.customer,
        item: action.payload.item,
        coinsInRegister: [],
        submitAttempts: 0,
        overpayAnimating: false,
        lastSubmitResult: null,
        currentRound: state.currentRound + 1,
      }
    }

    case 'DROP_COIN': {
      const { uid, denominationId, valueCents } = action.payload
      // Prevent double-count: skip if uid already in register
      const alreadyPresent = state.coinsInRegister.some(c => c.uid === uid)
      if (alreadyPresent) return state
      return {
        ...state,
        coinsInRegister: [
          ...state.coinsInRegister,
          { uid, denominationId, valueCents },
        ],
      }
    }

    case 'REMOVE_COIN': {
      return {
        ...state,
        coinsInRegister: state.coinsInRegister.filter(c => c.uid !== action.payload),
      }
    }

    case 'SUBMIT': {
      const { item, coinsInRegister, level } = state
      const totalCoins = coinsInRegister.reduce((sum, c) => sum + c.valueCents, 0)

      // For Level 3, the target is the change from $1.00
      const targetCents = level === 3 ? 100 - item.priceCents : item.priceCents
      const diff = totalCoins - targetCents

      if (diff === 0) {
        // Exact — correct!
        return {
          ...state,
          correctCount: state.correctCount + 1,
          roundResults: [
            ...state.roundResults,
            { correct: true, attempts: state.submitAttempts + 1 },
          ],
          lastSubmitResult: 'correct',
        }
      } else if (diff > 0) {
        // Overpay
        return {
          ...state,
          overpayAnimating: true,
          submitAttempts: state.submitAttempts + 1,
          lastSubmitResult: 'overpay',
        }
      } else {
        // Underpay
        return {
          ...state,
          submitAttempts: state.submitAttempts + 1,
          lastSubmitResult: 'underpay',
        }
      }
    }

    case 'OVERPAY_DONE': {
      return {
        ...state,
        overpayAnimating: false,
        lastSubmitResult: null,
      }
    }

    case 'NEXT_ROUND': {
      const isLastRound = state.currentRound >= state.rounds
      if (isLastRound) {
        return {
          ...state,
          screen: 'summary',
          lastSubmitResult: null,
        }
      }
      // More rounds remain — clear the board, keep scores
      return {
        ...state,
        customer: null,
        item: null,
        coinsInRegister: [],
        submitAttempts: 0,
        overpayAnimating: false,
        lastSubmitResult: null,
      }
    }

    case 'RESTART': {
      return { ...initialState }
    }

    default:
      return state
  }
}
