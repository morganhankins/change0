import { motion } from 'framer-motion'
import { toDisplayDollars } from '../utils/money'

/**
 * Displays the animated customer character and their speech bubble.
 *
 * @param {{ customer: object, item: object, level: number }} props
 */
export default function CustomerBubble({ customer, item, level }) {
  if (!customer || !item) return null

  const speechText =
    level === 3
      ? `Hi! I have $1.00 ${item.emoji}. Can you give me change for a ${item.name} that costs ${toDisplayDollars(item.priceCents)}?`
      : `Hi! I'd like a ${item.name} ${item.emoji} for ${toDisplayDollars(item.priceCents)} please!`

  return (
    <div className="flex items-center justify-center gap-6 h-full px-4">
      {/* Character column */}
      <div className="flex flex-col items-center gap-1">
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          // Idle oscillation
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl select-none"
            style={{ fontSize: '120px', lineHeight: 1 }}
          >
            {customer.emoji}
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-base font-bold text-near-black"
        >
          {customer.name}
        </motion.div>
      </div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 22 }}
        className="relative max-w-xs rounded-2xl bg-white shadow-md px-5 py-4 text-near-black"
        style={{ borderColor: customer.color, borderWidth: 3 }}
      >
        {/* Triangle pointer */}
        <div
          className="absolute left-[-16px] top-6 w-0 h-0"
          style={{
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: `16px solid ${customer.color}`,
          }}
        />
        <p className="text-lg font-bold leading-snug">{speechText}</p>
      </motion.div>
    </div>
  )
}
