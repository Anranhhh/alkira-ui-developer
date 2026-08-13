import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { useAuth } from '../context/AuthContext'

type Errors = {
  email?: string
  password?: string
  form?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const navigate = useNavigate()
  const { login, phase } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [showPassword, setShowPassword] = useState(false)

  if (phase === 'authenticated') return <Navigate to="/dashboard" replace />
  if (phase === 'mfa-pending') return <Navigate to="/mfa" replace />

  function validate(): Errors {
    const next: Errors = {}
    const trimmedEmail = email.trim()

    if (!trimmedEmail) next.email = 'Email is required.'
    else if (!EMAIL_PATTERN.test(trimmedEmail)) next.email = 'Enter a valid email address.'

    if (!password) next.password = 'Password is required.'
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.'

    return next
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = login(email, password)
    if (!result.ok) {
      setErrors({ form: result.message })
      return
    }

    setErrors({})
    navigate('/mfa')
  }

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <span className="eyebrow">Secure workspace access</span>
        <h1>Sign in to your network workspace</h1>
        <p>
          A focused authentication experience with multi-factor verification and role-aware access.
        </p>
        <div className="security-note">
          <span className="security-icon" aria-hidden="true">✓</span>
          <div>
            <strong>Demo environment</strong>
            <p>Use one of the mock accounts listed below. No credentials are sent to a server.</p>
          </div>
        </div>
      </div>

      <div className="auth-card">
        <div className="card-heading">
          <p className="kicker">Welcome back</p>
          <h2>Log in</h2>
          <p>Enter your credentials to continue.</p>
        </div>

        {errors.form && <div className="alert error-alert" role="alert">{errors.form}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (errors.email || errors.form) setErrors((current) => ({ ...current, email: undefined, form: undefined }))
            }}
            error={errors.email}
            placeholder="you@company.com"
          />

          <FormField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (errors.password || errors.form) setErrors((current) => ({ ...current, password: undefined, form: undefined }))
            }}
            error={errors.password}
            placeholder="Enter your password"
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Show password
          </label>

          <button className="primary-button full-width" type="submit">Continue</button>
        </form>

        <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>

        <div className="demo-credentials" aria-label="Mock credentials">
          <p><strong>Read-only:</strong> reader@alkira.demo / Reader123!</p>
          <p><strong>Read/write:</strong> writer@alkira.demo / Writer123!</p>
        </div>
      </div>
    </section>
  )
}
