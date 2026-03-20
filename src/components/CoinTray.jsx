import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { COIN_DENOMINATIONS } from '../utils/money'

/**
 * A single draggable coin or bill.
 * Each render of this component creates one draggable instance.
 * The uid is baked into the draggable id so each drag is unique.
 */
function DraggableCoin({ denomination, uid }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: uid,
    data: {
      denominationId: denomination.id,
      valueCents: denomination.valueCents,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 'auto',
  }

  const isBill = denomination.valueCents >= 100

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        select-none flex items-center justify-center
        font-extrabold shadow-md active:shadow-lg
        transition-shadow
        ${isBill
          ? 'w-20 h-10 rounded-lg bg-green-600 text-white text-sm'
          : 'w-16 h-16 rounded-full text-near-black text-base'
        }
      `}
      style={{
        ...style,
        backgroundColor: isBill
          ? '#15803d'
          : denomination.valueCents === 1
            ? '#b45309'   // penny — copper
            : denomination.valueCents === 5
              ? '#9ca3af'   // nickel — silver-ish
              : denomination.valueCents === 10
                ? '#d1d5db'   // dime — lighter silver
                : '#facc15',  // quarter — gold
        color: isBill || denomination.valueCents <= 5 ? '#fff' : '#1C1917',
      }}
    >
      {denomination.display}
    </div>
  )
}

/**
 * A coin source that generates a fresh uid on each render so
 * the supply is effectively infinite — each drag is a new coin.
 *
 * We render multiple instances per denomination so the player
 * can drag several of the same type in sequence.
 */
function CoinSource({ denomination }) {
  // Generate a stable-per-render uid using a closure over Date.now()
  const uid = `${denomination.id}-${Date.now()}-${Math.random()}`
  return <DraggableCoin denomination={denomination} uid={uid} />
}

/**
 * The bottom tray of draggable coins and bills.
 * Level 1: penny, nickel, dime, quarter
 * Level 2+: also $1 bill and $5 bill
 *
 * @param {{ level: number }} props
 */
export default function CoinTray({ level }) {
  const denominations = COIN_DENOMINATIONS.filter(d =>
    level >= 2 ? true : d.valueCents <= 25
  )

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-3 h-full">
      {denominations.map(denom => (
        // Key must change on each interaction to remount component and generate fresh uid.
        // We use a ref-free pattern: the component generates a uid on mount.
        <CoinSourceWrapper key={denom.id} denomination={denom} />
      ))}
    </div>
  )
}

/**
 * Wrapper that maintains a stable key per denomination type
 * but gives each draggable a unique uid via internal state.
 * Using a counter in the wrapper ensures infinite supply.
 */
function CoinSourceWrapper({ denomination }) {
  // Render an array of "slots" so multiple copies can be dragged
  // without re-keying the entire tray. Two visible copies is enough
  // since dnd-kit's drag-overlay approach means the original stays put.
  return (
    <div className="flex flex-col items-center gap-1">
      <CoinSource denomination={denomination} />
      <span className="text-xs font-semibold text-wood opacity-70">
        {denomination.label}
      </span>
    </div>
  )
}
