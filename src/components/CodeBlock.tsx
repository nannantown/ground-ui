import { useState, useCallback } from 'react'
import { cn } from '../cn'

interface CodeBlockProps {
  /** Code content as string */
  children: string
  /** Language label shown in header (e.g., "tsx", "bash") */
  language?: string
  /** Show copy button (default: true) */
  copyable?: boolean
  /** Optional title shown in header */
  title?: string
  /** Additional class names */
  className?: string
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function CodeBlock({
  children,
  language,
  copyable = true,
  title,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const showHeader = language || title || copyable

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [children])

  return (
    <div className={cn('code-block', className)}>
      {showHeader && (
        <div className="code-block-header">
          <span>{title || language || ''}</span>
          {copyable && (
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy code'}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          )}
        </div>
      )}
      <pre><code>{children}</code></pre>
    </div>
  )
}
