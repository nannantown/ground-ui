import { useState, useCallback, type ReactNode } from 'react'
import { cn } from '../cn'

export interface TreeNode {
  id: string
  label: string
  icon?: ReactNode
  children?: TreeNode[]
}

interface TreeProps {
  /** Tree data */
  nodes: TreeNode[]
  /** Called when a leaf node is selected */
  onSelect?: (id: string) => void
  /** Currently selected node id */
  selectedId?: string
  /** Initially expanded node ids */
  defaultExpanded?: string[]
  /** Additional class names */
  className?: string
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{
        transition: 'transform 0.15s ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function TreeItem({
  node,
  level,
  expandedIds,
  toggleExpand,
  selectedId,
  onSelect,
}: {
  node: TreeNode
  level: number
  expandedIds: Set<string>
  toggleExpand: (id: string) => void
  selectedId?: string
  onSelect?: (id: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const isSelected = node.id === selectedId

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected || undefined}>
      <div
        className={cn('tree-item', isSelected && 'tree-item-selected')}
        style={{ paddingLeft: level * 16 + 8 }}
        onClick={() => {
          if (hasChildren) toggleExpand(node.id)
          else onSelect?.(node.id)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (hasChildren) toggleExpand(node.id)
            else onSelect?.(node.id)
          }
        }}
        tabIndex={0}
        role="button"
      >
        {hasChildren ? (
          <ChevronIcon expanded={isExpanded} />
        ) : (
          <span style={{ width: 14, flexShrink: 0 }} />
        )}
        {node.icon && <span className="tree-item-icon">{node.icon}</span>}
        <span className="tree-item-label">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function Tree({ nodes, onSelect, selectedId, defaultExpanded = [], className }: TreeProps) {
  const [expandedIds, setExpandedIds] = useState(() => new Set(defaultExpanded))

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <ul role="tree" className={cn('tree', className)}>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}
