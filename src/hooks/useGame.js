import { useReducer, useEffect, useCallback } from 'react'
import { gameReducer, initialState } from '../store/gameReducer'
import { saveProgress } from '../utils/localStorage'
import { CUSTOMERS } from '../data/customers'
import { getRandomItem } from '../data/items'

/**
 * Core game hook. Manages state via useReducer and persists
 * progress to localStorage after each state change.
 */
export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Persist progress whenever game state changes
  useEffect(() => {
    if (state.screen !== 'difficulty') {
      saveProgress({
        level: state.level,
        correctCount: state.correctCount,
        currentRound: state.currentRound,
        roundResults: state.roundResults,
      })
    }
  }, [state])

  /**
   * Starts a new round: picks a random customer (different from last)
   * and a random item for the current level, then dispatches START_ROUND.
   */
  /**
   * Starts a new round. Accepts an optional overrideLevel so the first
   * round can be started from an event handler (before state.level updates).
   */
  const startRound = useCallback((overrideLevel) => {
    const lastId = state.customer?.id
    const available = CUSTOMERS.filter(c => c.id !== lastId)
    const customer = available[Math.floor(Math.random() * available.length)]
    const item = getRandomItem(overrideLevel ?? state.level)
    dispatch({ type: 'START_ROUND', payload: { customer, item } })
  }, [state.customer, state.level])

  return { state, dispatch, startRound }
}
