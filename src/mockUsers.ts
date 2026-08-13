import type { MockUser } from './types'

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-read-only',
    name: 'Riley Reader',
    email: 'reader@alkira.demo',
    password: 'Reader123!',
    role: 'read-only',
    mfaCode: '246810'
  },
  {
    id: 'user-read-write',
    name: 'Wendy Writer',
    email: 'writer@alkira.demo',
    password: 'Writer123!',
    role: 'read-write',
    mfaCode: '135790'
  }
]
