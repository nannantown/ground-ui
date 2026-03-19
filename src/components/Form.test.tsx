import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Form } from './Form'

afterEach(cleanup)

describe('Form', () => {
  it('renders children via render prop', () => {
    render(
      <Form initialValues={{ name: '' }} onSubmit={() => {}}>
        {({ values, handleChange }) => (
          <input value={values.name} onChange={handleChange} name="name" />
        )}
      </Form>
    )
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('provides initial values', () => {
    render(
      <Form initialValues={{ name: 'John' }} onSubmit={() => {}}>
        {({ values }) => <span>{values.name}</span>}
      </Form>
    )
    expect(screen.getByText('John')).toBeTruthy()
  })

  it('calls onSubmit with values', () => {
    const handler = vi.fn()
    render(
      <Form initialValues={{ email: 'test@test.com' }} onSubmit={handler}>
        {({ handleSubmit }) => (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </Form>
    )
    fireEvent.click(screen.getByText('Submit'))
    expect(handler).toHaveBeenCalledWith({ email: 'test@test.com' })
  })

  it('renders form element', () => {
    const { container } = render(
      <Form initialValues={{}} onSubmit={() => {}}>
        {() => <span>F</span>}
      </Form>
    )
    expect(container.querySelector('form')).toBeTruthy()
  })
})
