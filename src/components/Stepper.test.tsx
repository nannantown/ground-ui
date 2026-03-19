import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Stepper } from './Stepper'

afterEach(cleanup)

const steps = [
  { label: 'Account', description: 'Create account' },
  { label: 'Profile', description: 'Set up profile' },
  { label: 'Done' },
]

describe('Stepper', () => {
  // --- Rendering ---
  it('renders navigation with aria-label', () => {
    render(<Stepper steps={steps} activeStep={0} />)
    expect(screen.getByRole('navigation', { name: 'Progress' })).toBeTruthy()
  })

  it('renders all step labels', () => {
    render(<Stepper steps={steps} activeStep={0} />)
    expect(screen.getByText('Account')).toBeTruthy()
    expect(screen.getByText('Profile')).toBeTruthy()
    expect(screen.getByText('Done')).toBeTruthy()
  })

  it('applies stepper class', () => {
    const { container } = render(<Stepper steps={steps} activeStep={0} />)
    expect(container.querySelector('.stepper')).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(<Stepper steps={steps} activeStep={0} className="custom" />)
    expect(container.querySelector('.stepper')?.className).toContain('custom')
  })

  // --- Active step ---
  it('marks active step with aria-current="step"', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    const labels = screen.getAllByLabelText(/Step \d/)
    expect(labels[1].getAttribute('aria-current')).toBe('step')
  })

  it('does not set aria-current on non-active steps', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    const labels = screen.getAllByLabelText(/Step \d/)
    expect(labels[0].getAttribute('aria-current')).toBeNull()
    expect(labels[2].getAttribute('aria-current')).toBeNull()
  })

  // --- Clickable ---
  it('calls onStepClick when step is clicked', () => {
    const handler = vi.fn()
    render(<Stepper steps={steps} activeStep={0} onStepClick={handler} />)
    fireEvent.click(screen.getByText('Profile'))
    expect(handler).toHaveBeenCalledWith(1)
  })

  it('applies stepper-step-clickable when onStepClick provided', () => {
    const { container } = render(
      <Stepper steps={steps} activeStep={0} onStepClick={() => {}} />
    )
    expect(container.querySelector('.stepper-step-clickable')).toBeTruthy()
  })

  it('does not apply stepper-step-clickable without onStepClick', () => {
    const { container } = render(<Stepper steps={steps} activeStep={0} />)
    expect(container.querySelector('.stepper-step-clickable')).toBeNull()
  })

  // --- Keyboard ---
  it('supports Enter key on clickable steps', () => {
    const handler = vi.fn()
    render(<Stepper steps={steps} activeStep={0} onStepClick={handler} />)
    const step = screen.getAllByRole('button')[0]
    fireEvent.keyDown(step, { key: 'Enter' })
    expect(handler).toHaveBeenCalled()
  })

  // --- Vertical ---
  it('renders vertical orientation', () => {
    render(<Stepper steps={steps} activeStep={1} orientation="vertical" />)
    expect(screen.getByText('Account')).toBeTruthy()
    expect(screen.getByText('Profile')).toBeTruthy()
  })

  // --- Compact ---
  it('renders compact variant', () => {
    render(<Stepper steps={steps} activeStep={0} variant="compact" />)
    expect(screen.getByRole('navigation')).toBeTruthy()
  })

  // --- Optional ---
  it('shows Optional badge for optional steps', () => {
    const optSteps = [
      { label: 'Step 1' },
      { label: 'Step 2', optional: true },
    ]
    render(<Stepper steps={optSteps} activeStep={0} />)
    expect(screen.getByText('Optional')).toBeTruthy()
  })
})
