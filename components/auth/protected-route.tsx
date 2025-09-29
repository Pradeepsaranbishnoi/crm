"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import type { User } from "@/lib/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: User["role"][]
  fallbackPath?: string
}

export function ProtectedRoute({ children, requiredRoles = [], fallbackPath = "/login" }: ProtectedRouteProps) {
  const { user, isLoading, canAccess } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(fallbackPath)
        return
      }

      if (requiredRoles.length > 0 && !canAccess(requiredRoles)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, isLoading, canAccess, requiredRoles, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRoles.length > 0 && !canAccess(requiredRoles)) {
    return null
  }

  return <>{children}</>
}
