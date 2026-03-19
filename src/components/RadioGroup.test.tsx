import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

afterEach(cleanup)

/** Get native radio inputs (hidden) by container query */
function getRadioInputs(container: HTMLElement) {
  return Array.from(container.querySelectorAll('input[type="radio"]')) as HTMLInputElement[]
}

describe('RadioGroup', () => {
  // --- Rendering ---
  it('renders a radiogroup role', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>
    )
    expect(screen.getByRole('radiogroup')).toBeTruthy()
  })

  it('renders radio inputs for each item', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
      </RadioGroup>
    )
    expect(getRadioInputs(container)).toHaveLength(2)
  })

  it('renders labels', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" label="Option A" />
      </RadioGroup>
    )
    expect(screen.getByText('Option A')).toBeTruthy()
  })

  // --- Controlled ---
  it('checks the controlled value', () => {
    const { container } = render(
      <RadioGroup value="b">
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
      </RadioGroup>
    )
    const radios = getRadioInputs(container)
    expect(radios[0].checked).toBe(false)
    expect(radios[1].checked).toBe(true)
  })

  it('calls onChange with selected value', () => {
    const handler = vi.fn()
    const { container } = render(
      <RadioGroup value="a" onChange={handler}>
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
      </RadioGroup>
    )
    fireEvent.click(getRadioInputs(container)[1])
    expect(handler).toHaveBeenCalledWith('b')
  })

  // --- Uncontrolled ---
  it('selects defaultValue initially', () => {
    const { container } = render(
      <RadioGroup defaultValue="b">
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
      </RadioGroup>
    )
    expect(getRadioInputs(container)[1].checked).toBe(true)
  })

  it('toggles in uncontrolled mode', () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
      </RadioGroup>
    )
    const radios = getRadioInputs(container)
    fireEvent.click(radios[1])
    expect(radios[1].checked).toBe(true)
    expect(radios[0].checked).toBe(false)
  })

  // --- Disabled (group) ---
  it('disables all items when group is disabled', () => {
    const { container } = render(
      <RadioGroup disabled>
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
      </RadioGroup>
    )
    const radios = getRadioInputs(container)
    expect(radios[0].disabled).toBe(true)
    expect(radios[1].disabled).toBe(true)
  })

  // --- Disabled (item) ---
  it('disables individual items', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" disabled />
      </RadioGroup>
    )
    const radios = getRadioInputs(container)
    expect(radios[0].disabled).toBe(false)
    expect(radios[1].disabled).toBe(true)
  })

  // --- Name ---
  it('shares the same name across items', () => {
    const { container } = render(
      <RadioGroup name="color">
        <RadioGroupItem value="r" label="Red" />
        <RadioGroupItem value="g" label="Green" />
      </RadioGroup>
    )
    const radios = getRadioInputs(container)
    expect(radios[0].name).toBe('color')
    expect(radios[1].name).toBe('color')
  })

  // --- Visual radio ---
  it('renders visual radio span with radio class', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>
    )
    expect(container.querySelector('.radio')).toBeTruthy()
  })

  it('applies radio-checked class when selected', () => {
    const { container } = render(
      <RadioGroup value="a">
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>
    )
    expect(container.querySelector('.radio-checked')).toBeTruthy()
  })
})
