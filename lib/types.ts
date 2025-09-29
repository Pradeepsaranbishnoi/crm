// Core data models for the CRM platform
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "sales_rep"
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
  priority: "low" | "medium" | "high"
  value?: number
  source: "website" | "referral" | "cold_call" | "email" | "social" | "other"
  assignedTo?: string // User ID
  createdBy: string // User ID
  createdAt: Date
  updatedAt: Date
  closedAt?: Date
}

export interface Activity {
  id: string
  leadId: string
  userId: string
  type: "note" | "call" | "email" | "meeting" | "task"
  title: string
  description?: string
  scheduledAt?: Date
  completedAt?: Date
  createdAt: Date
}

export interface Note {
  id: string
  leadId: string
  userId: string
  content: string
  isCollaborative: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  closedWon: number
  closedLost: number
  totalValue: number
  conversionRate: number
  averageDealSize: number
}

export interface RealtimeUpdate {
  type: "lead_created" | "lead_updated" | "activity_added" | "note_updated"
  data: any
  userId: string
  timestamp: Date
}
