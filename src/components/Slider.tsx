import {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  type CSSProperties,
} from 'react'
import { cn } from '../cn'

/* ── Types ────────────────────────────────── */

interface SliderMark {
  value: number
  label?: string
}

interface SliderBaseProps {
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Disabled state */
  disabled?: boolean
  /** Show current value label */
  showValue?: boolean
  /** Accessible label */
  label?: string
  /** Mark points along the track */
  marks?: SliderMark[]
  /** Additional class name */
  className?: string
  /** Additional styles */
  style?: CSSProperties
}

interface SingleSliderProps extends SliderBaseProps {
  /** Range mode disabled */
  range?: false
  /** Current value */
  value: number
  /** Callback when value changes */
  onChange: (value: number) => void
  /** Not used in single mode */
  rangeValue?: never
  /** Not used in single mode */
  onRangeChange?: never
}

interface RangeSliderProps extends SliderBaseProps {
  /** Enable range (dual-thumb) mode */
  range: true
  /** Not used in range mode */
  value?: never
  /** Not used in range mode */
  onChange?: never
  /** Current range value [min, max] */
  rangeValue: [number, number]
  /** Callback when range changes */
  onRangeChange: (value: [number, number]) => void
}

type SliderProps = SingleSliderProps | RangeSliderProps

/* ── Helpers ──────────────────────────────── */

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

function roundToStep(val: number, step: number, min: number): number {
  const steps = Math.round((val - min) / step)
  return min + steps * step
}

function pctOf(val: number, min: number, max: number): number {
  if (max === min) return 0
  return ((val - min) / (max - min)) * 100
}

/* ── Shared inline styles ─────────────────── */

const trackStyle: CSSProperties = {
  position: 'relative',
  height: 4,
  borderRadius: 9999,
  background: 'var(--border-subtle)',
  cursor: 'pointer',
}

const trackDisabledStyle: CSSProperties = {
  ...trackStyle,
  opacity: 0.4,
  cursor: 'not-allowed',
}

const filledStyle = (left: number, width: number): CSSProperties => ({
  position: 'absolute',
  top: 0,
  left: `${left}%`,
  width: `${width}%`,
  height: '100%',
  borderRadius: 9999,
  background: 'var(--accent)',
  pointerEvents: 'none',
})

const thumbSize = 16
const thumbActiveSize = 20

const baseThumbStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  width: thumbSize,
  height: thumbSize,
  borderRadius: '50%',
  background: '#fff',
  border: '2px solid var(--accent)',
  transform: 'translate(-50%, -50%)',
  cursor: 'grab',
  transition: 'box-shadow 0.15s ease, width 0.15s ease, height 0.15s ease',
  outline: 'none',
  zIndex: 1,
}

const thumbHoverStyle: CSSProperties = {
  boxShadow: '0 0 0 4px var(--accent-bg)',
}

const thumbActiveStyle: CSSProperties = {
  width: thumbActiveSize,
  height: thumbActiveSize,
  cursor: 'grabbing',
  boxShadow: '0 0 0 6px var(--accent-bg-strong)',
}

const thumbFocusStyle: CSSProperties = {
  boxShadow: '0 0 0 3px var(--accent-bg-strong)',
}

const thumbDisabledStyle: CSSProperties = {
  cursor: 'not-allowed',
  background: 'var(--text-disabled)',
  borderColor: 'var(--text-disabled)',
}

const tooltipStyle: CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 8px)',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '2px 8px',
  borderRadius: 4,
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)',
  color: 'var(--text-primary)',
  fontSize: 'var(--text-xs)',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
}

const markDotStyle = (active: boolean): CSSProperties => ({
  position: 'absolute',
  top: '50%',
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: active ? 'var(--accent)' : 'var(--border-default)',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  transition: 'background 0.15s ease',
})

const markLabelStyle: CSSProperties = {
  position: 'absolute',
  top: 14,
  transform: 'translateX(-50%)',
  fontSize: 'var(--text-xs)',
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
}

/* ── Thumb sub-component ──────────────────── */

interface ThumbProps {
  pct: number
  value: number
  showValue: boolean
  disabled: boolean
  onPointerDown: (e: React.PointerEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  ariaLabel?: string
  ariaValueMin: number
  ariaValueMax: number
}

function Thumb({
  pct,
  value,
  showValue,
  disabled,
  onPointerDown,
  onKeyDown,
  ariaLabel,
  ariaValueMin,
  ariaValueMax,
}: ThumbProps) {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const [focused, setFocused] = useState(false)

  const computedStyle: CSSProperties = {
    ...baseThumbStyle,
    left: `${pct}%`,
    ...(disabled
      ? thumbDisabledStyle
      : {
          ...(hovered && !active ? thumbHoverStyle : {}),
          ...(active ? thumbActiveStyle : {}),
          ...(focused && !active ? thumbFocusStyle : {}),
        }),
  }

  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-valuenow={value}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-disabled={disabled}
      style={computedStyle}
      onPointerDown={(e) => {
        if (disabled) return
        setActive(true)
        onPointerDown(e)
      }}
      onPointerUp={() => setActive(false)}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setActive(false)
      }}
      onFocus={() => !disabled && setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={onKeyDown}
    >
      {showValue && (hovered || active || focused) && (
        <div style={tooltipStyle}>{value}</div>
      )}
    </div>
  )
}

/* ── Main component ───────────────────────── */

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (props, ref) => {
    const {
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      showValue = false,
      label,
      marks,
      className,
      style,
      range,
    } = props

    const trackRef = useRef<HTMLDivElement>(null)
    const draggingRef = useRef<'single' | 'start' | 'end' | null>(null)

    /* ── Value resolution ──────────────────── */

    const isSingle = !range
    const singleValue = isSingle ? (props as SingleSliderProps).value : 0
    const singleOnChange = isSingle ? (props as SingleSliderProps).onChange : undefined
    const rangeValue = range ? (props as RangeSliderProps).rangeValue : [min, min] as [number, number]
    const onRangeChange = range ? (props as RangeSliderProps).onRangeChange : undefined

    /* ── Pointer logic ─────────────────────── */

    const getValueFromPointer = useCallback(
      (clientX: number): number => {
        if (!trackRef.current) return min
        const rect = trackRef.current.getBoundingClientRect()
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
        const raw = min + ratio * (max - min)
        return clamp(roundToStep(raw, step, min), min, max)
      },
      [min, max, step],
    )

    const handlePointerMove = useCallback(
      (e: PointerEvent) => {
        const val = getValueFromPointer(e.clientX)

        if (draggingRef.current === 'single' && singleOnChange) {
          singleOnChange(val)
        } else if (draggingRef.current === 'start' && onRangeChange) {
          onRangeChange([Math.min(val, rangeValue[1]), rangeValue[1]])
        } else if (draggingRef.current === 'end' && onRangeChange) {
          onRangeChange([rangeValue[0], Math.max(val, rangeValue[0])])
        }
      },
      [getValueFromPointer, singleOnChange, onRangeChange, rangeValue],
    )

    const handlePointerUp = useCallback(() => {
      draggingRef.current = null
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }, [handlePointerMove])

    const startDrag = useCallback(
      (thumb: 'single' | 'start' | 'end') => (e: React.PointerEvent) => {
        if (disabled) return
        e.preventDefault()
        draggingRef.current = thumb
        document.addEventListener('pointermove', handlePointerMove)
        document.addEventListener('pointerup', handlePointerUp)
      },
      [disabled, handlePointerMove, handlePointerUp],
    )

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        document.removeEventListener('pointermove', handlePointerMove)
        document.removeEventListener('pointerup', handlePointerUp)
      }
    }, [handlePointerMove, handlePointerUp])

    /* ── Track click ───────────────────────── */

    const handleTrackClick = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return
        const val = getValueFromPointer(e.clientX)

        if (isSingle && singleOnChange) {
          singleOnChange(val)
        } else if (onRangeChange) {
          // Move the closer thumb
          const distStart = Math.abs(val - rangeValue[0])
          const distEnd = Math.abs(val - rangeValue[1])
          if (distStart <= distEnd) {
            onRangeChange([Math.min(val, rangeValue[1]), rangeValue[1]])
          } else {
            onRangeChange([rangeValue[0], Math.max(val, rangeValue[0])])
          }
        }
      },
      [disabled, getValueFromPointer, isSingle, singleOnChange, onRangeChange, rangeValue],
    )

    /* ── Keyboard ──────────────────────────── */

    const makeKeyHandler = useCallback(
      (thumb: 'single' | 'start' | 'end') => (e: React.KeyboardEvent) => {
        if (disabled) return
        let delta: number
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step
        else if (e.key === 'Home') delta = min - max // jump to min
        else if (e.key === 'End') delta = max - min // jump to max
        else return

        e.preventDefault()

        if (thumb === 'single' && singleOnChange) {
          singleOnChange(clamp(singleValue + delta, min, max))
        } else if (thumb === 'start' && onRangeChange) {
          const newVal = clamp(rangeValue[0] + delta, min, rangeValue[1])
          onRangeChange([newVal, rangeValue[1]])
        } else if (thumb === 'end' && onRangeChange) {
          const newVal = clamp(rangeValue[1] + delta, rangeValue[0], max)
          onRangeChange([rangeValue[0], newVal])
        }
      },
      [disabled, step, min, max, singleValue, singleOnChange, rangeValue, onRangeChange],
    )

    /* ── Render ────────────────────────────── */

    const filledLeft = isSingle ? 0 : pctOf(rangeValue[0], min, max)
    const filledWidth = isSingle
      ? pctOf(singleValue, min, max)
      : pctOf(rangeValue[1], min, max) - pctOf(rangeValue[0], min, max)

    return (
      <div
        ref={ref}
        className={cn('slider', className)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          ...style,
        }}
      >
        {/* Label row */}
        {label && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
              }}
            >
              {label}
            </span>
            {showValue && (
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {isSingle ? singleValue : `${rangeValue[0]} - ${rangeValue[1]}`}
              </span>
            )}
          </div>
        )}

        {/* Track container — extra padding for thumb overflow and marks */}
        <div
          style={{
            position: 'relative',
            padding: marks ? '10px 0 24px' : '10px 0',
          }}
        >
          {/* Track */}
          <div
            ref={trackRef}
            style={disabled ? trackDisabledStyle : trackStyle}
            onClick={handleTrackClick}
          >
            {/* Filled portion */}
            <div style={filledStyle(filledLeft, filledWidth)} />

            {/* Marks */}
            {marks?.map((mark) => {
              const pct = pctOf(mark.value, min, max)
              const isActive = isSingle
                ? mark.value <= singleValue
                : mark.value >= rangeValue[0] && mark.value <= rangeValue[1]

              return (
                <div key={mark.value} style={{ position: 'absolute', left: `${pct}%`, top: 0, height: '100%' }}>
                  <div style={markDotStyle(isActive)} />
                  {mark.label && <div style={markLabelStyle}>{mark.label}</div>}
                </div>
              )
            })}
          </div>

          {/* Thumb(s) */}
          {isSingle ? (
            <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 4 }}>
              <Thumb
                pct={pctOf(singleValue, min, max)}
                value={singleValue}
                showValue={showValue && !label}
                disabled={disabled}
                onPointerDown={startDrag('single')}
                onKeyDown={makeKeyHandler('single')}
                ariaLabel={label ?? 'Slider'}
                ariaValueMin={min}
                ariaValueMax={max}
              />
            </div>
          ) : (
            <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 4 }}>
              <Thumb
                pct={pctOf(rangeValue[0], min, max)}
                value={rangeValue[0]}
                showValue={showValue && !label}
                disabled={disabled}
                onPointerDown={startDrag('start')}
                onKeyDown={makeKeyHandler('start')}
                ariaLabel={label ? `${label} minimum` : 'Range minimum'}
                ariaValueMin={min}
                ariaValueMax={rangeValue[1]}
              />
              <Thumb
                pct={pctOf(rangeValue[1], min, max)}
                value={rangeValue[1]}
                showValue={showValue && !label}
                disabled={disabled}
                onPointerDown={startDrag('end')}
                onKeyDown={makeKeyHandler('end')}
                ariaLabel={label ? `${label} maximum` : 'Range maximum'}
                ariaValueMin={rangeValue[0]}
                ariaValueMax={max}
              />
            </div>
          )}
        </div>
      </div>
    )
  },
)

Slider.displayName = 'Slider'
