"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { AuthService } from "@/lib/auth"
import { WebSocketService } from "@/lib/websocket"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  hasRole: (role: User["role"]) => boolean
  canAccess: (roles: User["role"][]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = AuthService.getCurrentUser()
    if (currentUser && AuthService.isAuthenticated()) {
      setUser(currentUser)
      // Connect to WebSocket for real-time updates
      WebSocketService.getInstance().connect(currentUser.id)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await AuthService.login(email, password)
    if (result) {
      setUser(result.user)
      WebSocketService.getInstance().connect(result.user.id)
      return true
    }
    return false
  }

  const logout = async (): Promise<void> => {
    await AuthService.logout()
    setUser(null)
    WebSocketService.getInstance().disconnect()
  }

  const hasRole = (role: User["role"]): boolean => {
    return AuthService.hasRole(role)
  }

  const canAccess = (roles: User["role"][]): boolean => {
    return AuthService.canAccess(roles)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        hasRole,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
