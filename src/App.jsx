import { useEffect } from 'react'
import { useGame } from './hooks/useGame'
import { GameContext } from './context/GameContext'
import DifficultySelect from './components/DifficultySelect'
import GameScreen from './components/GameScreen'
import RoundSummary from './components/RoundSummary'

/**
 * Root component. Owns game state via useGame, provides it via GameContext,
 * and routes between screens: difficulty → playing → summary.
 */
export default function App() {
  const { state, dispatch, startRound } = useGame()

  // For Level 3 the "target" is the change owed from $1.00
  const targetCents =
    state.level === 3 && state.item
      ? 100 - state.item.priceCents
      : state.item?.priceCents ?? 0

  // Kick off subsequent rounds when NEXT_ROUND clears the item mid-game.
  // The very first round is started directly from the DifficultySelect click
  // handler (via onSelect below) to avoid StrictMode double-firing this effect.
  useEffect(() => {
    if (state.screen === 'playing' && !state.item && state.currentRound > 0) {
      startRound()
    }
  }, [state.screen, state.item, state.currentRound, startRound])

  const contextValue = { state, dispatch, startRound, targetCents }

  if (state.screen === 'difficulty') {
    return (
      <DifficultySelect
        onSelect={(level) => {
          dispatch({ type: 'SET_LEVEL', payload: level })
          startRound(level)
        }}
      />
    )
  }

  if (state.screen === 'summary') {
    return (
      <GameContext.Provider value={contextValue}>
        <RoundSummary
          roundResults={state.roundResults}
          level={state.level}
          onRestart={() => dispatch({ type: 'RESTART' })}
          onLevelUp={(level) => dispatch({ type: 'SET_LEVEL', payload: level })}
        />
      </GameContext.Provider>
    )
  }

  // screen === 'playing'
  return (
    <GameContext.Provider value={contextValue}>
      <GameScreen />
    </GameContext.Provider>
  )
}
