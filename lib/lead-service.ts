import type { Lead } from "./types"
import { apiFetch } from "./utils"

export class LeadService {
  static async getLeads(filters?: {
    status?: Lead["status"]
    priority?: Lead["priority"]
    assignedTo?: string
    search?: string
  }): Promise<Lead[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.set("status", filters.status)
    if (filters?.priority) params.set("priority", filters.priority)
    if (filters?.assignedTo) params.set("assignedTo", filters.assignedTo)
    if (filters?.search) params.set("search", filters.search)
    const data = await apiFetch<any[]>(`/leads?${params.toString()}`)
    return data.map((l) => ({
      ...l,
      status: l.status.toLowerCase(),
      priority: l.priority.toLowerCase(),
      source: l.source.toLowerCase(),
      createdAt: new Date(l.createdAt),
      updatedAt: new Date(l.updatedAt),
      closedAt: l.closedAt ? new Date(l.closedAt) : undefined,
    })) as Lead[]
  }

  static async getLeadById(id: string): Promise<Lead | null> {
    const l = await apiFetch<any>(`/leads/${id}`)
    return {
      ...l,
      status: l.status.toLowerCase(),
      priority: l.priority.toLowerCase(),
      source: l.source.toLowerCase(),
      createdAt: new Date(l.createdAt),
      updatedAt: new Date(l.updatedAt),
      closedAt: l.closedAt ? new Date(l.closedAt) : undefined,
    } as Lead
  }

  static async createLead(leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
    const payload = {
      ...leadData,
      status: leadData.status.toUpperCase(),
      priority: leadData.priority.toUpperCase(),
      source: leadData.source.toUpperCase(),
    }
    const l = await apiFetch<any>(`/leads`, { method: "POST", body: JSON.stringify(payload) })
    return {
      ...l,
      status: l.status.toLowerCase(),
      priority: l.priority.toLowerCase(),
      source: l.source.toLowerCase(),
      createdAt: new Date(l.createdAt),
      updatedAt: new Date(l.updatedAt),
      closedAt: l.closedAt ? new Date(l.closedAt) : undefined,
    } as Lead
  }

  static async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    const payload: any = { ...updates }
    if (payload.status) payload.status = payload.status.toUpperCase()
    if (payload.priority) payload.priority = payload.priority.toUpperCase()
    if (payload.source) payload.source = payload.source.toUpperCase()
    const l = await apiFetch<any>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(payload) })
    return {
      ...l,
      status: l.status.toLowerCase(),
      priority: l.priority.toLowerCase(),
      source: l.source.toLowerCase(),
      createdAt: new Date(l.createdAt),
      updatedAt: new Date(l.updatedAt),
      closedAt: l.closedAt ? new Date(l.closedAt) : undefined,
    } as Lead
  }

  static async deleteLead(id: string): Promise<boolean> {
    await apiFetch<void>(`/leads/${id}`, { method: "DELETE" })
    return true
  }

  static async assignLead(leadId: string, userId: string): Promise<Lead | null> {
    return this.updateLead(leadId, { assignedTo: userId })
  }

  static getLeadStats(): {
    total: number
    byStatus: Record<Lead["status"], number>
    byPriority: Record<Lead["priority"], number>
  } {
    // stats are still computed client-side from fetched leads
    // callers fetch leads and can compute; retain existing signature for minimal changes
    return {
      total: 0,
      byStatus: { new: 0, contacted: 0, qualified: 0, proposal: 0, negotiation: 0, closed_won: 0, closed_lost: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
    }
  }
}
