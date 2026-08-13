import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'

beforeEach(() => {
  window.sessionStorage.clear()
  window.history.pushState({}, '', '/login')
})

describe('authentication flow', () => {
  it('shows client-side validation errors', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
  })

  it('completes MFA and exposes edit actions for a read/write user', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Email'), 'writer@alkira.demo')
    await user.type(screen.getByLabelText('Password'), 'Writer123!')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(await screen.findByRole('heading', { name: /verify your identity/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Verification code'), '135790')
    await user.click(screen.getByRole('button', { name: /verify and continue/i }))

    expect(await screen.findByRole('heading', { name: /network connections/i })).toBeInTheDocument()
    expect(screen.getByText('Read / write')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(3)
  })

  it('disables edit controls for a read-only user', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Email'), 'reader@alkira.demo')
    await user.type(screen.getByLabelText('Password'), 'Reader123!')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.type(await screen.findByLabelText('Verification code'), '246810')
    await user.click(screen.getByRole('button', { name: /verify and continue/i }))

    const addButton = await screen.findByRole('button', { name: /add connection/i })
    expect(addButton).toBeDisabled()
    expect(screen.getAllByRole('button', { name: /disabled for read-only role/i })).toHaveLength(3)
  })
})
