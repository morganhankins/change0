import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { toDollars } from '../utils/money'

/**
 * The drop zone where coins are placed to make change.
 * Visual states: empty (pulsing dashed), active, overpay (red jiggle), success (green).
 *
 * @param {{
 *   coinsInRegister: Array<{uid: string, denominationId: string, valueCents: number}>,
 *   onRemoveCoin: (uid: string) => void,
 *   isOverpaying: boolean,
 *   overpayAnimating: boolean,
 *   isCorrect: boolean,
 * }} props
 */
export default function RegisterZone({
  coinsInRegister,
  onRemoveCoin,
  isOverpaying,
  overpayAnimating,
  isCorrect,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'register-zone' })
  const isEmpty = coinsInRegister.length === 0

  let borderClass = 'border-amber border-dashed'
  let bgClass = 'bg-cream'

  if (isCorrect) {
    borderClass = 'border-emerald border-solid'
    bgClass = 'bg-green-50'
  } else if (isOverpaying || overpayAnimating) {
    borderClass = 'border-red-500 border-solid'
    bgClass = 'bg-red-50'
  } else if (isOver) {
    borderClass = 'border-amber border-solid'
    bgClass = 'bg-yellow-50'
  }

  return (
    <motion.div
      ref={setNodeRef}
      animate={
        overpayAnimating
          ? { x: [0, -10, 10, -10, 0] }
          : { x: 0 }
      }
      transition={overpayAnimating ? { duration: 0.3 } : {}}
      className={`
        relative w-full h-full rounded-2xl border-4 ${borderClass} ${bgClass}
        flex flex-wrap gap-2 content-start p-3 overflow-auto
        transition-colors duration-200
        ${isEmpty ? 'items-center justify-center' : ''}
      `}
      style={{ minHeight: 80 }}
    >
      {isEmpty && (
        <span className={`text-wood font-bold text-lg select-none pulse-border`}>
          Drop coins here 🪙
        </span>
      )}

      {isCorrect && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
          <span className="text-5xl">✅</span>
        </div>
      )}

      {!isCorrect && coinsInRegister.map(coin => (
        <motion.button
          key={coin.uid}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => onRemoveCoin(coin.uid)}
          title="Click to remove"
          className={`
            flex items-center justify-center rounded-full
            font-bold text-sm text-white shadow-md cursor-pointer
            transition-transform hover:scale-110 active:scale-95
            ${coin.valueCents >= 100 ? 'rounded-lg w-16 h-8 bg-green-600' : 'w-10 h-10 bg-yellow-500'}
          `}
        >
          {toDollars(coin.valueCents)}
        </motion.button>
      ))}
    </motion.div>
  )
}
