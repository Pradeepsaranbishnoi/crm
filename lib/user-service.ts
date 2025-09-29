import type { User } from "./types"
import { WebSocketService } from "./websocket"
import { apiFetch } from "./utils"

// User management service with CRUD operations and role management
export class UserService {
  static async getUsers(filters?: {
    role?: User["role"]
    search?: string
  }): Promise<User[]> {
    const data = await apiFetch<any[]>(`/users`)
    let users: User[] = data.map((u) => ({
      ...u,
      role: u.role.toLowerCase(),
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
    }))
    if (filters?.role) users = users.filter((u) => u.role === filters.role)
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      users = users.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
    }
    return users.sort((a, b) => a.name.localeCompare(b.name))
  }

  static async getUserById(id: string): Promise<User | null> {
    const u = await apiFetch<any>(`/users/${id}`)
    return { ...u, role: u.role.toLowerCase(), createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt) }
  }

  static async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt"> & { password: string }): Promise<User> {
    const payload = { ...userData, role: userData.role.toUpperCase() }
    const u = await apiFetch<any>(`/users`, { method: "POST", body: JSON.stringify(payload) })
    WebSocketService.getInstance().emit("user_created", u)
    return { ...u, role: u.role.toLowerCase(), createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt) }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const payload: any = { ...updates }
    if (payload.role) payload.role = payload.role.toUpperCase()
    const u = await apiFetch<any>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) })
    WebSocketService.getInstance().emit("user_updated", { id, data: u })
    return { ...u, role: u.role.toLowerCase(), createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt) }
  }

  static async deleteUser(id: string): Promise<boolean> {
    await apiFetch<void>(`/users/${id}`, { method: "DELETE" })
    WebSocketService.getInstance().emit("user_deleted", { id })
    return true
  }

  static async updateUserRole(id: string, role: User["role"]): Promise<User | null> {
    return this.updateUser(id, { role })
  }

  static getUserStats(): {
    total: number
    byRole: Record<User["role"], number>
    active: number
  } {
    const stats = {
      total: this.users.length,
      byRole: {
        admin: 0,
        manager: 0,
        sales_rep: 0,
      } as Record<User["role"], number>,
      active: this.users.length, // In a real app, this would track actual activity
    }

    this.users.forEach((user) => {
      stats.byRole[user.role]++
    })

    return stats
  }

  static getRolePermissions(role: User["role"]): {
    canManageUsers: boolean
    canManageAllLeads: boolean
    canViewReports: boolean
    canManageSettings: boolean
    canDeleteLeads: boolean
    canAssignLeads: boolean
  } {
    switch (role) {
      case "admin":
        return {
          canManageUsers: true,
          canManageAllLeads: true,
          canViewReports: true,
          canManageSettings: true,
          canDeleteLeads: true,
          canAssignLeads: true,
        }
      case "manager":
        return {
          canManageUsers: false,
          canManageAllLeads: true,
          canViewReports: true,
          canManageSettings: false,
          canDeleteLeads: true,
          canAssignLeads: true,
        }
      case "sales_rep":
        return {
          canManageUsers: false,
          canManageAllLeads: false,
          canViewReports: false,
          canManageSettings: false,
          canDeleteLeads: false,
          canAssignLeads: false,
        }
      default:
        return {
          canManageUsers: false,
          canManageAllLeads: false,
          canViewReports: false,
          canManageSettings: false,
          canDeleteLeads: false,
          canAssignLeads: false,
        }
    }
  }
}
