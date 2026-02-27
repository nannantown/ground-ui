import { useCallback, useId, useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '../cn'

export interface AccordionItem {
  value: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  /** Array of accordion items to render */
  items: AccordionItem[]
  /** Allow single or multiple items open at once */
  type?: 'single' | 'multiple'
  /** Initially open item(s) — string for single, string[] for multiple */
  defaultValue?: string | string[]
  className?: string
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function normalizeDefaultValue(
  defaultValue: string | string[] | undefined,
  type: 'single' | 'multiple'
): string[] {
  if (defaultValue === undefined) return []
  if (Array.isArray(defaultValue)) {
    return type === 'single' ? defaultValue.slice(0, 1) : defaultValue
  }
  return [defaultValue]
}

const DURATION = 250

function AccordionContent({
  isOpen,
  id,
  children,
}: {
  isOpen: boolean
  id: string
  children: ReactNode
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const prevOpen = useRef(isOpen)

  // Set initial state without animation
  useEffect(() => {
    const el = contentRef.current
    if (el && isOpen) {
      el.style.maxHeight = 'none'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (prevOpen.current === isOpen) return
    prevOpen.current = isOpen

    const el = contentRef.current
    const inner = innerRef.current
    if (!el || !inner) return

    if (isOpen) {
      // Opening: animate from 0 to scrollHeight, then unlock
      const height = inner.scrollHeight
      el.style.maxHeight = `${height}px`
      const timer = setTimeout(() => {
        el.style.maxHeight = 'none'
      }, DURATION)
      return () => clearTimeout(timer)
    } else {
      // Closing: snap to explicit height, then animate to 0
      const height = inner.scrollHeight
      el.style.transition = 'none'
      el.style.maxHeight = `${height}px`
      // Force reflow so browser registers the explicit height
      void el.offsetHeight
      // Re-enable CSS transition, animate to 0
      el.style.transition = ''
      el.style.maxHeight = '0px'
    }
  }, [isOpen])

  return (
    <div
      ref={contentRef}
      id={id}
      role="region"
      className="accordion-content"
    >
      <div ref={innerRef} className="accordion-content-inner">
        {children}
      </div>
    </div>
  )
}

export function Accordion({
  items,
  type = 'single',
  defaultValue,
  className,
}: AccordionProps) {
  const baseId = useId()
  const [openItems, setOpenItems] = useState<string[]>(() =>
    normalizeDefaultValue(defaultValue, type)
  )

  const toggle = useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const isOpen = prev.includes(value)
        if (type === 'single') {
          return isOpen ? [] : [value]
        }
        // multiple
        return isOpen ? prev.filter((v) => v !== value) : [...prev, value]
      })
    },
    [type]
  )

  return (
    <div className={cn('accordion', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.value)
        const triggerId = `${baseId}-trigger-${item.value}`
        const contentId = `${baseId}-content-${item.value}`

        return (
          <div
            key={item.value}
            className="accordion-item"
            data-state={isOpen ? 'open' : 'closed'}
          >
            <button
              id={triggerId}
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => toggle(item.value)}
            >
              {item.title}
              <span className="accordion-trigger-icon">
                <ChevronDownIcon />
              </span>
            </button>
            <AccordionContent isOpen={isOpen} id={contentId}>
              {item.content}
            </AccordionContent>
          </div>
        )
      })}
    </div>
  )
}

Accordion.displayName = 'Accordion'
