import { forwardRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../cn'

export interface StepperStep {
  /** Step label text */
  label: string
  /** Optional step description */
  description?: string
  /** Custom icon to display instead of step number */
  icon?: ReactNode
  /** Mark step as optional */
  optional?: boolean
}

interface StepperProps {
  /** Array of step definitions */
  steps: StepperStep[]
  /** Index of the currently active step (0-based) */
  activeStep: number
  /** Called when a step circle is clicked */
  onStepClick?: (stepIndex: number) => void
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical'
  /** Display variant */
  variant?: 'default' | 'compact'
  /** Custom icon shown for completed steps (defaults to checkmark SVG) */
  completedIcon?: ReactNode
  className?: string
}

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

type StepStatus = 'completed' | 'active' | 'upcoming'

function getStepStatus(stepIndex: number, activeStep: number): StepStatus {
  if (stepIndex < activeStep) return 'completed'
  if (stepIndex === activeStep) return 'active'
  return 'upcoming'
}

/* ── Shared styles ── */

const circleSize = 32
const circleSmall = 24
const connectorThickness = 2

const baseCircleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  fontWeight: 600,
  flexShrink: 0,
  transition: 'all 0.2s ease',
  position: 'relative',
}

function circleStyles(status: StepStatus, compact: boolean): CSSProperties {
  const size = compact ? circleSmall : circleSize
  const fontSize = compact ? 11 : 12

  const base: CSSProperties = {
    ...baseCircleStyle,
    width: size,
    height: size,
    fontSize,
  }

  switch (status) {
    case 'completed':
      return {
        ...base,
        background: 'var(--accent)',
        color: '#fff',
        border: '2px solid var(--accent)',
      }
    case 'active':
      return {
        ...base,
        background: 'transparent',
        color: 'var(--accent)',
        border: '2px solid var(--accent)',
        boxShadow: '0 0 0 3px var(--accent-bg)',
      }
    case 'upcoming':
      return {
        ...base,
        background: 'transparent',
        color: 'var(--text-secondary)',
        border: '2px solid var(--border-default)',
      }
  }
}

function connectorStyle(completed: boolean, vertical: boolean): CSSProperties {
  if (vertical) {
    return {
      width: connectorThickness,
      flexGrow: 1,
      minHeight: 24,
      background: completed ? 'var(--accent)' : 'var(--border-default)',
      transition: 'background 0.2s ease',
      borderRadius: connectorThickness / 2,
    }
  }
  return {
    height: connectorThickness,
    flexGrow: 1,
    background: completed ? 'var(--accent)' : 'var(--border-default)',
    transition: 'background 0.2s ease',
    borderRadius: connectorThickness / 2,
  }
}

function labelStyle(status: StepStatus): CSSProperties {
  return {
    fontSize: 'var(--text-sm)',
    fontWeight: status === 'active' ? 600 : 500,
    color: status === 'upcoming' ? 'var(--text-secondary)' : 'var(--text-primary)',
    lineHeight: 1.3,
    transition: 'color 0.15s ease',
  }
}

function descriptionStyle(): CSSProperties {
  return {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    marginTop: 2,
  }
}

function optionalBadgeStyle(): CSSProperties {
  return {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-disabled)',
    fontWeight: 400,
    fontStyle: 'italic',
  }
}

/* ── Step Circle ── */

function StepCircle({
  step,
  index,
  status,
  compact,
  completedIcon,
}: {
  step: StepperStep
  index: number
  status: StepStatus
  compact: boolean
  completedIcon?: ReactNode
}) {
  const content = (() => {
    if (status === 'completed') {
      return completedIcon ?? <CheckIcon />
    }
    if (step.icon) return step.icon
    return index + 1
  })()

  return <div style={circleStyles(status, compact)}>{content}</div>
}

/* ── Horizontal Stepper ── */

function HorizontalStepper({
  steps,
  activeStep,
  onStepClick,
  variant,
  completedIcon,
}: Omit<StepperProps, 'orientation' | 'className'>) {
  const compact = variant === 'compact'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index, activeStep)
        const isLast = index === steps.length - 1
        const clickable = !!onStepClick

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flex: isLast ? '0 0 auto' : '1 1 0',
            }}
          >
            {/* Step content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: compact ? 4 : 8,
                cursor: clickable ? 'pointer' : 'default',
                minWidth: compact ? 40 : 64,
              }}
              onClick={clickable ? () => onStepClick(index) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onStepClick(index)
                      }
                    }
                  : undefined
              }
              tabIndex={clickable ? 0 : undefined}
              role={clickable ? 'button' : undefined}
              aria-label={`Step ${index + 1}: ${step.label}`}
              aria-current={status === 'active' ? 'step' : undefined}
            >
              <StepCircle
                step={step}
                index={index}
                status={status}
                compact={compact}
                completedIcon={completedIcon}
              />

              {!compact && (
                <div style={{ textAlign: 'center', maxWidth: 120 }}>
                  <div style={labelStyle(status)}>{step.label}</div>
                  {step.optional && (
                    <div style={optionalBadgeStyle()}>Optional</div>
                  )}
                  {step.description && (
                    <div style={descriptionStyle()}>{step.description}</div>
                  )}
                </div>
              )}
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: '1 1 0',
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: compact ? circleSmall / 2 : circleSize / 2,
                }}
              >
                <div
                  style={connectorStyle(
                    index < activeStep,
                    false
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Vertical Stepper ── */

function VerticalStepper({
  steps,
  activeStep,
  onStepClick,
  variant,
  completedIcon,
}: Omit<StepperProps, 'orientation' | 'className'>) {
  const compact = variant === 'compact'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {steps.map((step, index) => {
        const status = getStepStatus(index, activeStep)
        const isLast = index === steps.length - 1
        const clickable = !!onStepClick

        return (
          <div key={index} style={{ display: 'flex', gap: compact ? 8 : 12 }}>
            {/* Left column: circle + connector */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{ cursor: clickable ? 'pointer' : 'default' }}
                onClick={clickable ? () => onStepClick(index) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onStepClick(index)
                        }
                      }
                    : undefined
                }
                tabIndex={clickable ? 0 : undefined}
                role={clickable ? 'button' : undefined}
                aria-label={`Step ${index + 1}: ${step.label}`}
                aria-current={status === 'active' ? 'step' : undefined}
              >
                <StepCircle
                  step={step}
                  index={index}
                  status={status}
                  compact={compact}
                  completedIcon={completedIcon}
                />
              </div>

              {!isLast && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 1,
                    paddingTop: 4,
                    paddingBottom: 4,
                  }}
                >
                  <div
                    style={connectorStyle(
                      index < activeStep,
                      true
                    )}
                  />
                </div>
              )}
            </div>

            {/* Right column: label + description */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: compact ? 2 : 4,
                paddingBottom: isLast ? 0 : compact ? 12 : 20,
                minHeight: compact ? undefined : 48,
              }}
            >
              <div style={labelStyle(status)}>
                {step.label}
                {step.optional && (
                  <span style={{ ...optionalBadgeStyle(), marginLeft: 6 }}>
                    (Optional)
                  </span>
                )}
              </div>
              {step.description && !compact && (
                <div style={descriptionStyle()}>{step.description}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Main Export ── */

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      activeStep,
      onStepClick,
      orientation = 'horizontal',
      variant = 'default',
      completedIcon,
      className,
    },
    ref
  ) => {
    const inner =
      orientation === 'vertical' ? (
        <VerticalStepper
          steps={steps}
          activeStep={activeStep}
          onStepClick={onStepClick}
          variant={variant}
          completedIcon={completedIcon}
        />
      ) : (
        <HorizontalStepper
          steps={steps}
          activeStep={activeStep}
          onStepClick={onStepClick}
          variant={variant}
          completedIcon={completedIcon}
        />
      )

    return (
      <div
        ref={ref}
        className={cn('stepper', className)}
        role="navigation"
        aria-label="Progress"
        style={{ width: '100%' }}
      >
        {inner}
      </div>
    )
  }
)

Stepper.displayName = 'Stepper'
