import { useEffect, useRef, useCallback } from 'react'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

import { useGameContext } from '../context/GameContext'
import { COIN_DENOMINATIONS, toDollars } from '../utils/money'

import Header from './Header'
import CustomerBubble from './CustomerBubble'
import RegisterZone from './RegisterZone'
import RunningTotal from './RunningTotal'
import CoinTray from './CoinTray'

/**
 * Main game screen. Orchestrates drag-and-drop, submission logic,
 * feedback overlays, and round transitions.
 */
export default function GameScreen() {
  const { state, dispatch, startRound, targetCents } = useGameContext()
  const {
    level,
    currentRound,
    rounds,
    correctCount,
    customer,
    item,
    coinsInRegister,
    submitAttempts,
    overpayAnimating,
    lastSubmitResult,
  } = state

  const feedbackTimer = useRef(null)
  const nextRoundTimer = useRef(null)

  const totalCents = coinsInRegister.reduce((s, c) => s + c.valueCents, 0)
  const isOverpaying = totalCents > targetCents
  const isCorrect = lastSubmitResult === 'correct'

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    })
  )

  // Handle overpay animation cleanup
  useEffect(() => {
    if (overpayAnimating) {
      const t = setTimeout(() => dispatch({ type: 'OVERPAY_DONE' }), 350)
      return () => clearTimeout(t)
    }
  }, [overpayAnimating, dispatch])

  // Handle correct answer: confetti → wait → next round
  useEffect(() => {
    if (isCorrect) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#F59E0B', '#DC6B4A', '#10B981', '#6366F1', '#EC4899'],
      })

      // Speak success via Web Speech API if available
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance('Great job!')
        utt.rate = 0.9
        window.speechSynthesis.speak(utt)
      }

      nextRoundTimer.current = setTimeout(() => {
        dispatch({ type: 'NEXT_ROUND' })
        // startRound is called via the useEffect that watches !item after NEXT_ROUND clears item
      }, 1500)
    }
    return () => clearTimeout(nextRoundTimer.current)
  }, [isCorrect, dispatch])

  // When the screen transitions away from 'playing' after NEXT_ROUND,
  // the App-level useEffect handles starting the next round via the
  // item === null check. No extra wiring needed here.

  // Drag end handler
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event
      if (!over || over.id !== 'register-zone') return

      const { denominationId, valueCents } = active.data.current
      dispatch({
        type: 'DROP_COIN',
        payload: {
          uid: String(active.id),
          denominationId,
          valueCents,
        },
      })
    },
    [dispatch]
  )

  const handleSubmit = useCallback(() => {
    dispatch({ type: 'SUBMIT' })
  }, [dispatch])

  const handleRemoveCoin = useCallback(
    (uid) => dispatch({ type: 'REMOVE_COIN', payload: uid }),
    [dispatch]
  )

  // Find denomination data for DragOverlay
  const getDenomById = (id) =>
    COIN_DENOMINATIONS.find(d => d.id === id)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-cream font-nunito">
      {/* Header */}
      <Header
        level={level}
        currentRound={currentRound}
        rounds={rounds}
        correctCount={correctCount}
      />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {/* Customer zone — 35% */}
        <div className="flex-none" style={{ height: '35%' }}>
          <AnimatePresence mode="wait">
            {customer && item && (
              <motion.div
                key={`${customer.id}-${currentRound}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <CustomerBubble customer={customer} item={item} level={level} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Register + total — 25% */}
        <div className="flex-none flex flex-col items-center gap-2 px-4 py-2" style={{ height: '25%' }}>
          <div className="w-full flex gap-3 items-stretch" style={{ height: 'calc(100% - 56px)' }}>
            <div className="flex-1">
              <RegisterZone
                coinsInRegister={coinsInRegister}
                onRemoveCoin={handleRemoveCoin}
                isOverpaying={isOverpaying}
                overpayAnimating={overpayAnimating}
                isCorrect={isCorrect}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 min-w-[80px]">
              <RunningTotal
                totalCents={totalCents}
                priceCents={targetCents}
                isOverpaying={isOverpaying}
              />
            </div>
          </div>

          {/* Feedback text + Submit button row */}
          <div className="flex items-center gap-4 h-10">
            <AnimatePresence mode="wait">
              {lastSubmitResult === 'underpay' && (
                <motion.span
                  key="underpay"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-amber font-bold text-base"
                >
                  A little more! 🤔
                </motion.span>
              )}
              {(lastSubmitResult === 'overpay' || (isOverpaying && lastSubmitResult === 'overpay')) && (
                <motion.span
                  key="overpay"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 font-bold text-base"
                >
                  Hmm, a bit too much! 😅
                </motion.span>
              )}
              {isCorrect && (
                <motion.span
                  key="correct"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-emerald font-extrabold text-xl"
                >
                  🎉 Correct!
                </motion.span>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={totalCents === 0 || isCorrect}
              className={`
                px-6 py-2 rounded-full font-extrabold text-lg shadow transition-all
                ${totalCents > 0 && !isCorrect
                  ? 'bg-amber text-white hover:bg-yellow-500 active:scale-95 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              ✓ Submit
            </button>
          </div>
        </div>

        {/* Coin tray — 35% */}
        <div className="flex-1 border-t-2 border-amber/30 bg-white/40">
          <CoinTray level={level} />
        </div>
      </DndContext>
    </div>
  )
}
