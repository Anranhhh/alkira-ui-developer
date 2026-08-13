import type { InputHTMLAttributes } from 'react'

type Props = {
  label: string
  id: string
  error?: string
  hint?: string
} & InputHTMLAttributes<HTMLInputElement>

export function FormField({ label, id, error, hint, ...inputProps }: Props) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={error ? 'input-error' : undefined}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">{hint}</p>
      ) : null}
    </div>
  )
}
