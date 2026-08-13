import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function MfaPage() {
  const navigate = useNavigate()
  const { phase, pendingEmail, verifyMfa, cancelMfa } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (phase === 'authenticated') return <Navigate to="/dashboard" replace />
  if (phase !== 'mfa-pending') return <Navigate to="/login" replace />

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit verification code.')
      return
    }

    const result = verifyMfa(code)
    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate('/dashboard')
  }

  function goBack() {
    cancelMfa()
    navigate('/login')
  }

  return (
    <section className="centered-page">
      <div className="auth-card compact-card">
        <button className="text-button back-button" type="button" onClick={goBack}>← Back to login</button>
        <div className="mfa-icon" aria-hidden="true">✦</div>
        <div className="card-heading centered-heading">
          <p className="kicker">Second step</p>
          <h1>Verify your identity</h1>
          <p>We sent a 6-digit code to <strong>{pendingEmail}</strong>.</p>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="field-group">
            <label htmlFor="mfa-code">Verification code</label>
            <input
              id="mfa-code"
              className={`otp-input ${error ? 'input-error' : ''}`}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                if (error) setError('')
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'mfa-error' : 'mfa-hint'}
              placeholder="000000"
              autoFocus
            />
            {error ? <p id="mfa-error" className="field-error" role="alert">{error}</p> : (
              <p id="mfa-hint" className="field-hint">Demo codes: reader 246810 · writer 135790</p>
            )}
          </div>
          <button className="primary-button full-width" type="submit">Verify and continue</button>
        </form>
      </div>
    </section>
  )
}
