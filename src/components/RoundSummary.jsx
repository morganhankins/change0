import { motion } from 'framer-motion'

/**
 * End-of-game summary screen.
 *
 * @param {{
 *   roundResults: Array<{correct: boolean, attempts: number}>,
 *   level: number,
 *   onRestart: () => void,
 *   onLevelUp: (level: number) => void,
 * }} props
 */
export default function RoundSummary({ roundResults, level, onRestart, onLevelUp }) {
  const total = roundResults.length
  const correct = roundResults.filter(r => r.correct).length
  const pct = total > 0 ? correct / total : 0

  const bigEmoji = pct > 0.8 ? '🌟' : pct >= 0.6 ? '⭐' : '😊'
  const stars = pct > 0.8 ? 3 : pct >= 0.6 ? 2 : 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-6 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="flex flex-col items-center gap-6 max-w-sm w-full"
      >
        {/* Big emoji */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl select-none"
        >
          {bigEmoji}
        </motion.div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold text-near-black text-center">
          You helped {total} customer{total !== 1 ? 's' : ''}!
        </h1>

        {/* Accuracy */}
        <p className="text-2xl font-bold text-wood text-center">
          {correct} out of {total} correct
        </p>

        {/* Stars */}
        <div className="flex gap-2 text-5xl">
          {[1, 2, 3].map(s => (
            <motion.span
              key={s}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: s <= stars ? 1 : 0.6, opacity: s <= stars ? 1 : 0.25 }}
              transition={{ delay: s * 0.15, type: 'spring', stiffness: 300, damping: 18 }}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Round-by-round recap */}
        <div className="flex gap-2 flex-wrap justify-center">
          {roundResults.map((r, i) => (
            <span
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow ${r.correct ? 'bg-emerald text-white' : 'bg-red-400 text-white'}`}
              title={r.correct ? `Round ${i + 1}: correct in ${r.attempts} attempt(s)` : `Round ${i + 1}: missed`}
            >
              {r.correct ? '✓' : '✗'}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            className="w-full py-4 rounded-2xl bg-amber text-white font-extrabold text-xl shadow-lg hover:bg-yellow-500 transition-colors"
          >
            Play Again
          </motion.button>

          {level < 3 && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onLevelUp(level + 1)}
              className="w-full py-4 rounded-2xl bg-terracotta text-white font-extrabold text-xl shadow-lg hover:bg-red-500 transition-colors"
            >
              Try Harder Level 🔥
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
