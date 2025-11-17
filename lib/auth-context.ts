import { createContext, useContext } from 'react'

export type UserRole = 'admin' | 'manager' | 'employee'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface AuthUser {
  id: string
  email: string
  full_name: string
  role: UserRole
  status: UserStatus
  department?: string
  base_salary: number
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
