/**
 * Slim header bar showing level, current round, and score.
 *
 * @param {{ level: number, currentRound: number, rounds: number, correctCount: number }} props
 */
export default function Header({ level, currentRound, rounds, correctCount }) {
  const levelConfig = {
    1: { label: 'L1', bg: 'bg-emerald', text: 'text-white' },
    2: { label: 'L2', bg: 'bg-amber',   text: 'text-white' },
    3: { label: 'L3', bg: 'bg-terracotta', text: 'text-white' },
  }[level] ?? { label: `L${level}`, bg: 'bg-gray-400', text: 'text-white' }

  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white/60 backdrop-blur-sm border-b border-amber/30 shrink-0">
      {/* Level badge */}
      <div className={`px-3 py-1 rounded-full font-bold text-sm ${levelConfig.bg} ${levelConfig.text}`}>
        {levelConfig.label}
      </div>

      {/* Round indicator */}
      <div className="text-near-black font-bold text-base">
        Round {currentRound} of {rounds}
      </div>

      {/* Score */}
      <div className="text-near-black font-semibold text-sm">
        {correctCount} correct
      </div>
    </header>
  )
}
