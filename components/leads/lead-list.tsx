"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LeadService } from "@/lib/lead-service"
import { mockUsers } from "@/lib/mock-data"
import { useAuth } from "@/components/auth/auth-provider"
import { WebSocketService } from "@/lib/websocket"
import type { Lead } from "@/lib/types"
import { Plus, Search, Phone, Mail, Building, DollarSign, Edit } from "lucide-react"
import { LeadDialog } from "./lead-dialog"
import { LeadDetailView } from "./lead-detail-view"

const statusColors = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  qualified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  proposal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  closed_won: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  closed_lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadLeads()

    // Listen for real-time updates
    const ws = WebSocketService.getInstance()
    ws.on("lead_created", handleLeadUpdate)
    ws.on("lead_updated", handleLeadUpdate)
    ws.on("lead_deleted", handleLeadDelete)

    return () => {
      ws.off("lead_created", handleLeadUpdate)
      ws.off("lead_updated", handleLeadUpdate)
      ws.off("lead_deleted", handleLeadDelete)
    }
  }, [])

  useEffect(() => {
    applyFilters()
  }, [leads, searchTerm, statusFilter, priorityFilter, assigneeFilter])

  const loadLeads = async () => {
    const leadsData = await LeadService.getLeads()
    setLeads(leadsData)
  }

  const handleLeadUpdate = () => {
    loadLeads()
  }

  const handleLeadDelete = (data: { id: string }) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== data.id))
  }

  const applyFilters = () => {
    let filtered = [...leads]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company?.toLowerCase().includes(searchLower),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((lead) => lead.priority === priorityFilter)
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter((lead) => lead.assignedTo === assigneeFilter)
    }

    setFilteredLeads(filtered)
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDialogOpen(true)
  }

  const handleCreateLead = () => {
    setSelectedLead(null)
    setIsDialogOpen(true)
  }

  const handleViewLead = (leadId: string) => {
    setSelectedLeadId(leadId)
  }

  const handleBackToList = () => {
    setSelectedLeadId(null)
  }

  const getAssigneeName = (userId?: string) => {
    if (!userId) return "Unassigned"
    const user = mockUsers.find((u) => u.id === userId)
    return user?.name || "Unknown"
  }

  const getAssigneeAvatar = (userId?: string) => {
    if (!userId) return undefined
    const user = mockUsers.find((u) => u.id === userId)
    return user?.avatar
  }

  if (selectedLeadId) {
    return <LeadDetailView leadId={selectedLeadId} onBack={handleBackToList} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Lead Management</h1>
          <p className="text-muted-foreground">Manage and track your sales leads</p>
        </div>
        <Button onClick={handleCreateLead} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="closed_lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLeads.map((lead) => (
          <Card
            key={lead.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewLead(lead.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={statusColors[lead.status]}>{lead.status.replace("_", " ")}</Badge>
                  <Badge variant="outline" className={priorityColors[lead.priority]}>
                    {lead.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {lead.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.company}</span>
                  </div>
                )}

                {lead.value && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${lead.value.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={getAssigneeAvatar(lead.assignedTo) || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {getAssigneeName(lead.assignedTo)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{getAssigneeName(lead.assignedTo)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(lead.updatedAt).toLocaleDateString()}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditLead(lead)
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No leads found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Get started by creating your first lead."}
              </p>
              {!searchTerm && statusFilter === "all" && priorityFilter === "all" && assigneeFilter === "all" && (
                <Button onClick={handleCreateLead} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Lead
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <LeadDialog lead={selectedLead} open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={loadLeads} />
    </div>
  )
}
