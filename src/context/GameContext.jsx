import { createContext, useContext } from 'react'

/**
 * Provides game state, dispatch, startRound, and targetCents
 * to the entire component tree without prop drilling.
 */
export const GameContext = createContext(null)

/**
 * Convenience hook for consuming the game context.
 * @returns {{ state: object, dispatch: function, startRound: function, targetCents: number }}
 */
export const useGameContext = () => useContext(GameContext)
