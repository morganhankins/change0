import { motion, AnimatePresence } from 'framer-motion'
import { toDollars } from '../utils/money'

/**
 * Displays the running total of coins in the register.
 * Color-coded: gray (empty), amber (partial), green (exact), red (overpay).
 *
 * @param {{ totalCents: number, priceCents: number, isOverpaying: boolean }} props
 */
export default function RunningTotal({ totalCents, priceCents, isOverpaying }) {
  let colorClass = 'text-gray-400'
  let label = toDollars(totalCents)

  if (totalCents === 0) {
    colorClass = 'text-gray-400'
    label = '0¢'
  } else if (isOverpaying || totalCents > priceCents) {
    colorClass = 'text-red-500'
  } else if (totalCents === priceCents) {
    colorClass = 'text-emerald'
  } else {
    colorClass = 'text-amber'
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={totalCents}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`text-5xl font-extrabold ${colorClass} tabular-nums`}
        >
          {label}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      {priceCents > 0 && (
        <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isOverpaying || totalCents > priceCents ? 'bg-red-500' : totalCents === priceCents ? 'bg-emerald' : 'bg-amber'}`}
            animate={{ width: `${Math.min(100, Math.round((totalCents / priceCents) * 100))}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            style={{ width: 0 }}
          />
        </div>
      )}
    </div>
  )
}
