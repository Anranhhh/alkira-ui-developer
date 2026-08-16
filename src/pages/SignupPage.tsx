import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FormField } from '../components/FormField'

export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubmitted(true)
    }
  }

  return (
    <section className="centered-page">
      <div className="auth-card compact-card">
        <div className="card-heading">
          <h1>Create an account</h1>
          <p>This demo captures intent only; registration is intentionally not persisted.</p>
        </div>

        {submitted ? (
          <div className="success-panel" role="status">
            <div className="success-icon">✓</div>
            <h2>Account Created!</h2>
            <p>Thanks, {name}. In a production app, the next step would verify your email and create the account.</p>
            <Link className="primary-button button-link" to="/login">Return to login</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <FormField id="signup-name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
            <FormField id="signup-email" label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" />
            <button className="primary-button full-width" type="submit">Create</button>
            <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
          </form>
        )}
      </div>
    </section>
  )
}
