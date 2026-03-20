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

  // Kick off the first round whenever we enter playing with no item yet
  useEffect(() => {
    if (state.screen === 'playing' && !state.item) {
      startRound()
    }
  }, [state.screen, state.item, startRound])

  const contextValue = { state, dispatch, startRound, targetCents }

  if (state.screen === 'difficulty') {
    return (
      <DifficultySelect
        onSelect={(level) => {
          dispatch({ type: 'SET_LEVEL', payload: level })
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
