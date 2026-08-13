import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="brand-bar" aria-label="Application header">
        <a className="brand" href="/" aria-label="Alkira Access home">
          <span className="brand-mark" aria-hidden="true">A</span>
        </a>
        <span className="exercise-label">Jiaqiao Han - UI Developer Exercise</span>
      </header>
      <main className="main-content">{children}</main>
    </div>
  )
}
