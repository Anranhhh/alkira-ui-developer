import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { phase } = useAuth()

  if (phase !== 'authenticated') {
    return <Navigate to={phase === 'mfa-pending' ? '/mfa' : '/login'} replace />
  }

  return children
}
