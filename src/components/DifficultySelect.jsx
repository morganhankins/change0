import { motion } from 'framer-motion'

const LEVELS = [
  {
    level: 1,
    label: 'Easy — Coins Only',
    description: 'Prices under $1 · Use pennies, nickels, dimes & quarters',
    bg: 'bg-emerald',
    border: 'border-emerald',
    hover: 'hover:bg-green-600',
  },
  {
    level: 2,
    label: 'Medium — Bills & Coins',
    description: 'Prices under $5 · Add dollar bills to the mix',
    bg: 'bg-amber',
    border: 'border-amber',
    hover: 'hover:bg-yellow-500',
  },
  {
    level: 3,
    label: 'Hard — Exact Change',
    description: 'Make exact change from $1 · No rounding allowed',
    bg: 'bg-terracotta',
    border: 'border-terracotta',
    hover: 'hover:bg-red-500',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

/**
 * Full-screen difficulty picker shown at game start.
 * @param {{ onSelect: (level: number) => void }} props
 */
export default function DifficultySelect({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <motion.div
        className="w-full max-w-lg flex flex-col items-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-6xl font-extrabold text-near-black tracking-tight">
            Change! 🪙
          </h1>
          <p className="mt-3 text-xl font-semibold text-wood">
            Help customers make change at the shop!
          </p>
        </motion.div>

        {/* Level buttons */}
        {LEVELS.map(({ level, label, description, bg, hover }) => (
          <motion.button
            key={level}
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(level)}
            className={`w-full rounded-2xl px-8 py-5 text-left text-white shadow-lg transition-colors ${bg} ${hover} focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-wood`}
          >
            <div className="text-2xl font-extrabold">{label}</div>
            <div className="mt-1 text-base font-semibold opacity-90">{description}</div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
