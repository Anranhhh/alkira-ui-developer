import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { MOCK_USERS } from '../mockUsers'
import type { AuthPhase, MockUser } from '../types'

type LoginResult = { ok: true } | { ok: false; message: string }
type MfaResult = { ok: true } | { ok: false; message: string }

type AuthContextValue = {
  phase: AuthPhase
  user: MockUser | null
  pendingEmail: string | null
  login: (email: string, password: string) => LoginResult
  verifyMfa: (code: string) => MfaResult
  cancelMfa: () => void
  logout: () => void
}

const SESSION_KEY = 'alkira-auth-session'

type StoredSession = {
  phase: AuthPhase
  userId: string | null
  pendingUserId: string | null
}

const defaultSession: StoredSession = {
  phase: 'signed-out',
  userId: null,
  pendingUserId: null
}

function readStoredSession(): StoredSession {
  if (typeof window === 'undefined') return defaultSession
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    if (!raw) return defaultSession
    const parsed = JSON.parse(raw) as StoredSession
    return parsed
  } catch {
    return defaultSession
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = readStoredSession()
  const [phase, setPhase] = useState<AuthPhase>(stored.phase)
  const [userId, setUserId] = useState<string | null>(stored.userId)
  const [pendingUserId, setPendingUserId] = useState<string | null>(stored.pendingUserId)

  const user = useMemo(
    () => MOCK_USERS.find((candidate) => candidate.id === userId) ?? null,
    [userId]
  )

  const pendingUser = useMemo(
    () => MOCK_USERS.find((candidate) => candidate.id === pendingUserId) ?? null,
    [pendingUserId]
  )

  function persist(next: StoredSession) {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
  }

  function login(email: string, password: string): LoginResult {
    const match = MOCK_USERS.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.password === password
    )

    if (!match) {
      return { ok: false, message: 'Email or password is incorrect.' }
    }

    setPhase('mfa-pending')
    setPendingUserId(match.id)
    setUserId(null)
    persist({ phase: 'mfa-pending', userId: null, pendingUserId: match.id })
    return { ok: true }
  }

  function verifyMfa(code: string): MfaResult {
    if (!pendingUser) {
      return { ok: false, message: 'Your sign-in session expired. Please log in again.' }
    }

    if (code.trim() !== pendingUser.mfaCode) {
      return { ok: false, message: 'That verification code is incorrect.' }
    }

    setPhase('authenticated')
    setUserId(pendingUser.id)
    setPendingUserId(null)
    persist({ phase: 'authenticated', userId: pendingUser.id, pendingUserId: null })
    return { ok: true }
  }

  function cancelMfa() {
    setPhase('signed-out')
    setUserId(null)
    setPendingUserId(null)
    persist(defaultSession)
  }

  function logout() {
    cancelMfa()
  }

  const value: AuthContextValue = {
    phase,
    user,
    pendingEmail: pendingUser?.email ?? null,
    login,
    verifyMfa,
    cancelMfa,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
