import type { User } from "./types"
import { apiFetch } from "./utils"

// Backend-powered authentication service
export class AuthService {
  private static currentUser: User | null = null

  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      const result = await apiFetch<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: (result.user.role?.toString().toLowerCase() as User["role"]) || "sales_rep",
        avatar: result.user.avatar || undefined,
        createdAt: new Date(result.user.createdAt),
        updatedAt: new Date(result.user.updatedAt),
      }
      this.currentUser = user
      localStorage.setItem("crm_jwt", result.token)
      localStorage.setItem("crm_user", JSON.stringify(user))
      return { user, token: result.token }
    } catch {
      return null
    }
  }

  static async logout(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem("crm_jwt")
    localStorage.removeItem("crm_user")
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser
    const userStr = localStorage.getItem("crm_user")
    if (userStr) {
      this.currentUser = JSON.parse(userStr)
      return this.currentUser
    }
    return null
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem("crm_jwt")
    return !!token
  }

  static hasRole(role: User["role"]): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  static canAccess(requiredRoles: User["role"][]): boolean {
    const user = this.getCurrentUser()
    return user ? requiredRoles.includes(user.role) : false
  }
}
