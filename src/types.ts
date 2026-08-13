export type Role = 'read-only' | 'read-write'

export type MockUser = {
  id: string
  name: string
  email: string
  password: string
  role: Role
  mfaCode: string
}

export type AuthPhase = 'signed-out' | 'mfa-pending' | 'authenticated'
