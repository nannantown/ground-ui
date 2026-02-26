import {
  useState,
  useRef,
  useEffect,
  useCallback,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'

export interface CascadingMenuItem {
  /** Display label */
  label: string
  /** Optional icon rendered before label */
  icon?: ReactNode
  /** Action handler — not called if item has children */
  onClick?: () => void
  /** Disable the item */
  disabled?: boolean
  /** Nested submenu items */
  children?: CascadingMenuItem[]
}

interface CascadingMenuProps {
  /** Element that opens the menu on click */
  trigger: ReactElement
  /** Menu item definitions */
  items: CascadingMenuItem[]
  /** Alignment of the menu relative to the trigger */
  align?: 'left' | 'right'
}

// ─── Shared inline styles ─────────────────────────────────

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  zIndex: 9999,
  minWidth: 180,
  maxWidth: 280,
  borderRadius: 8,
  overflow: 'hidden',
  paddingTop: 4,
  paddingBottom: 4,
  background: 'var(--bg-elevated, #1e1e1e)',
  border: '1px solid var(--border-default)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
}

const itemBaseStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  paddingLeft: 12,
  paddingRight: 12,
  paddingTop: 8,
  paddingBottom: 8,
  fontSize: 14,
  lineHeight: 1.4,
  color: 'var(--text-secondary)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  font: 'inherit',
  transition: 'background-color 0.12s ease, color 0.12s ease',
}

const chevronSvg = (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, opacity: 0.5 }}
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
)

// ─── MenuPanel (recursive) ────────────────────────────────

interface MenuPanelProps {
  items: CascadingMenuItem[]
  position: { top: number; left: number }
  onClose: () => void
  depth: number
}

function MenuPanel({ items, position, onClose, depth }: MenuPanelProps) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null)
  const [submenuPos, setSubmenuPos] = useState({ top: 0, left: 0 })
  const panelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clamp panel position to viewport
  const [adjustedPos, setAdjustedPos] = useState(position)

  useEffect(() => {
    if (!panelRef.current) return

    const frameId = requestAnimationFrame(() => {
      const el = panelRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const padding = 8

      let top = position.top
      let left = position.left

      if (rect.bottom > window.innerHeight - padding) {
        top = Math.max(padding, window.innerHeight - rect.height - padding)
      }
      if (rect.right > window.innerWidth - padding) {
        // Flip to left side
        left = position.left - rect.width - 4
        if (left < padding) left = padding
      }
      if (top !== position.top || left !== position.left) {
        setAdjustedPos({ top, left })
      }
    })

    return () => cancelAnimationFrame(frameId)
  }, [position])

  // Focus management
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]!.focus()
    }
  }, [activeIndex])

  // Close on outside click (root panel only)
  useEffect(() => {
    if (depth > 0) return
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const frameId = requestAnimationFrame(() => {
      document.addEventListener('mousedown', handleClick)
    })
    return () => {
      cancelAnimationFrame(frameId)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [depth, onClose])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const openSubmenu = useCallback((index: number) => {
    const el = itemRefs.current[index]
    if (!el) return
    const rect = el.getBoundingClientRect()
    setSubmenuPos({
      top: rect.top,
      left: rect.right + 4,
    })
    setOpenSubmenuIndex(index)
  }, [])

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const enabledIndices = items
        .map((item, i) => (!item.disabled ? i : -1))
        .filter((i) => i >= 0)

      if (enabledIndices.length === 0) return

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          const currentPos = enabledIndices.indexOf(activeIndex)
          const next =
            currentPos < 0
              ? enabledIndices[0]
              : enabledIndices[(currentPos + 1) % enabledIndices.length]
          setActiveIndex(next)
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          const currentPos = enabledIndices.indexOf(activeIndex)
          const prev =
            currentPos < 0
              ? enabledIndices[enabledIndices.length - 1]
              : enabledIndices[
                  (currentPos - 1 + enabledIndices.length) %
                    enabledIndices.length
                ]
          setActiveIndex(prev)
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          const item = items[activeIndex]
          if (item?.children && !item.disabled) {
            openSubmenu(activeIndex)
          }
          break
        }
        case 'ArrowLeft': {
          e.preventDefault()
          if (depth > 0) {
            onClose()
          }
          break
        }
        case 'Enter':
        case ' ': {
          e.preventDefault()
          const item = items[activeIndex]
          if (item && !item.disabled) {
            if (item.children) {
              openSubmenu(activeIndex)
            } else {
              item.onClick?.()
              onClose()
            }
          }
          break
        }
      }
    },
    [activeIndex, items, openSubmenu, onClose, depth]
  )

  const handleItemClick = useCallback(
    (item: CascadingMenuItem, index: number) => {
      if (item.disabled) return
      if (item.children) {
        openSubmenu(index)
      } else {
        item.onClick?.()
        onClose()
      }
    },
    [openSubmenu, onClose]
  )

  const handleItemMouseEnter = useCallback(
    (index: number) => {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current)
        hoverTimer.current = null
      }

      setActiveIndex(index)

      const item = items[index]
      if (item?.children && !item.disabled) {
        hoverTimer.current = setTimeout(() => {
          openSubmenu(index)
        }, 150)
      } else {
        // Close any open submenu after a brief delay
        hoverTimer.current = setTimeout(() => {
          setOpenSubmenuIndex(null)
        }, 100)
      }
    },
    [items, openSubmenu]
  )

  // Cleanup hover timer
  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current)
    }
  }, [])

  return createPortal(
    <div
      ref={panelRef}
      role="menu"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      style={{
        ...panelStyle,
        top: adjustedPos.top,
        left: adjustedPos.left,
        animation: 'ground-menu-fade-in 0.12s ease-out',
      }}
    >
      <style>{`
        @keyframes ground-menu-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {items.map((item, index) => {
        const isActive = activeIndex === index
        const hasChildren = Boolean(item.children && item.children.length > 0)

        return (
          <button
            key={`${item.label}-${index}`}
            ref={(el) => { itemRefs.current[index] = el }}
            role="menuitem"
            tabIndex={isActive ? 0 : -1}
            disabled={item.disabled}
            onClick={() => handleItemClick(item, index)}
            onMouseEnter={() => handleItemMouseEnter(index)}
            style={{
              ...itemBaseStyle,
              background: isActive ? 'var(--hover-bg)' : 'transparent',
              color: item.disabled
                ? 'var(--text-disabled)'
                : isActive
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
              opacity: item.disabled ? 0.4 : 1,
              cursor: item.disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {item.icon && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  width: 16,
                  height: 16,
                }}
              >
                {item.icon}
              </span>
            )}
            <span style={{ flex: 1 }}>{item.label}</span>
            {hasChildren && chevronSvg}
          </button>
        )
      })}

      {openSubmenuIndex !== null &&
        items[openSubmenuIndex]?.children && (
          <MenuPanel
            items={items[openSubmenuIndex].children!}
            position={submenuPos}
            onClose={() => setOpenSubmenuIndex(null)}
            depth={depth + 1}
          />
        )}
    </div>,
    document.body
  )
}

// ─── CascadingMenu (root) ─────────────────────────────────

export function CascadingMenu({
  trigger,
  items,
  align = 'left',
}: CascadingMenuProps) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleOpen = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setMenuPos({
      top: rect.bottom + 4,
      left: align === 'right' ? rect.right - 180 : rect.left,
    })
    setOpen(true)
  }, [align])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleToggle = useCallback(() => {
    if (open) {
      handleClose()
    } else {
      handleOpen()
    }
  }, [open, handleOpen, handleClose])

  const triggerElement = isValidElement(trigger) ? (
    <div
      ref={triggerRef}
      onClick={(e) => {
        e.stopPropagation()
        handleToggle()
      }}
      style={{ display: 'inline-block' }}
    >
      {cloneElement(trigger)}
    </div>
  ) : null

  return (
    <>
      {triggerElement}
      {open && (
        <MenuPanel
          items={items}
          position={menuPos}
          onClose={handleClose}
          depth={0}
        />
      )}
    </>
  )
}

CascadingMenu.displayName = 'CascadingMenu'
