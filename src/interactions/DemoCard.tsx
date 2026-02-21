
import { useState, useCallback, type ReactNode } from 'react'

export interface InteractionOutput {
  valueA: number // 0-1 (Primary color hue mapped)
  valueB: number // 0-1 (Secondary color hue mapped)
}

export interface DemoProps {
  onChange: (output: InteractionOutput) => void
}

function hueToHsl(value: number): string {
  const hue = Math.round(value * 360)
  return `hsl(${hue}, 70%, 55%)`
}

export function DemoCard({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: (props: DemoProps) => ReactNode
}) {
  const [output, setOutput] = useState<InteractionOutput>({ valueA: 0.5, valueB: 0.5 })

  const handleChange = useCallback((newOutput: InteractionOutput) => {
    setOutput({
      valueA: Math.max(0, Math.min(1, newOutput.valueA)),
      valueB: Math.max(0, Math.min(1, newOutput.valueB)),
    })
  }, [])

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'var(--bg-surface)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}
        >
          {number}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </span>
      </div>

      {/* Interactive Area */}
      <div
        style={{
          padding: 16,
          minHeight: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children({ onChange: handleChange })}
      </div>

      {/* Output Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '10px 16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-primary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: hueToHsl(output.valueA),
              border: '1px solid var(--border-default)',
              transition: 'background 0.1s ease',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            A: {output.valueA.toFixed(2)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: hueToHsl(output.valueB),
              border: '1px solid var(--border-default)',
              transition: 'background 0.1s ease',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            B: {output.valueB.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
