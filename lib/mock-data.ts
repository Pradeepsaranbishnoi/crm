import type { User, Lead, Activity, Note } from "./types"

// Mock users for development
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@crm.com",
    name: "Sarah Johnson",
    role: "admin",
    avatar: "/professional-woman-diverse.png",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "manager@crm.com",
    name: "Mike Chen",
    role: "manager",
    avatar: "/professional-man.jpg",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    email: "sales@crm.com",
    name: "Emily Rodriguez",
    role: "sales_rep",
    avatar: "/confident-saleswoman.png",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
]

// Mock leads for development
export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@techcorp.com",
    phone: "+1-555-0123",
    company: "TechCorp Inc.",
    status: "qualified",
    priority: "high",
    value: 50000,
    source: "website",
    assignedTo: "3",
    createdBy: "2",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Lisa Wang",
    email: "lisa@startup.io",
    phone: "+1-555-0124",
    company: "Startup.io",
    status: "new",
    priority: "medium",
    value: 25000,
    source: "referral",
    assignedTo: "3",
    createdBy: "2",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "David Brown",
    email: "david@enterprise.com",
    phone: "+1-555-0125",
    company: "Enterprise Solutions",
    status: "proposal",
    priority: "high",
    value: 100000,
    source: "cold_call",
    assignedTo: "3",
    createdBy: "1",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-22"),
  },
]

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: "1",
    leadId: "1",
    userId: "3",
    type: "call",
    title: "Discovery Call",
    description: "Discussed requirements and budget. Client is interested in enterprise package.",
    completedAt: new Date("2024-01-20"),
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    leadId: "2",
    userId: "3",
    type: "email",
    title: "Follow-up Email",
    description: "Sent product information and pricing details",
    completedAt: new Date("2024-01-19"),
    createdAt: new Date("2024-01-19"),
  },
  {
    id: "3",
    leadId: "1",
    userId: "2",
    type: "meeting",
    title: "Product Demo",
    description: "Conducted 45-minute product demonstration. Very positive response.",
    completedAt: new Date("2024-01-22"),
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "4",
    leadId: "3",
    userId: "3",
    type: "call",
    title: "Proposal Discussion",
    description: "Reviewed proposal details and addressed concerns about implementation timeline.",
    completedAt: new Date("2024-01-21"),
    createdAt: new Date("2024-01-21"),
  },
]

// Mock notes
export const mockNotes: Note[] = [
  {
    id: "1",
    leadId: "1",
    userId: "3",
    content:
      "Very interested in our enterprise package. Budget confirmed at $50k. Decision maker identified as John Smith.",
    isCollaborative: false,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    leadId: "2",
    userId: "3",
    content: "Startup looking for cost-effective solution. May need custom pricing for their budget constraints.",
    isCollaborative: false,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    leadId: "3",
    userId: "2",
    content: "Large enterprise deal. Multiple stakeholders involved. Need to schedule follow-up with technical team.",
    isCollaborative: true,
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
]
