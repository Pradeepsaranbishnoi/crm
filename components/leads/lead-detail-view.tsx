"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LeadService } from "@/lib/lead-service"
import { mockUsers } from "@/lib/mock-data"
import { CollaborativeNotes } from "@/components/collaboration/collaborative-notes"
import { LiveActivityFeed } from "@/components/collaboration/live-activity-feed"
import { ActivityTimeline } from "@/components/activities/activity-timeline"
import type { Lead } from "@/lib/types"
import { ArrowLeft, Phone, Mail, Building, DollarSign, Calendar, User } from "lucide-react"

interface LeadDetailViewProps {
  leadId: string
  onBack: () => void
}

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

export function LeadDetailView({ leadId, onBack }: LeadDetailViewProps) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLead()
  }, [leadId])

  const loadLead = async () => {
    try {
      const leadData = await LeadService.getLeadById(leadId)
      setLead(leadData)
    } catch (error) {
      console.error("Error loading lead:", error)
    } finally {
      setIsLoading(false)
    }
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading lead details...</p>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Lead not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
      </div>

      {/* Lead Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{lead.name}</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {lead.email}
                </span>
                {lead.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={statusColors[lead.status]}>{lead.status.replace("_", " ")}</Badge>
              <Badge variant="outline" className={priorityColors[lead.priority]}>
                {lead.priority} priority
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lead.company && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{lead.company}</p>
                </div>
              </div>
            )}

            {lead.value && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Deal Value</p>
                  <p className="text-sm text-muted-foreground">${lead.value.toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={getAssigneeAvatar(lead.assignedTo) || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {getAssigneeName(lead.assignedTo)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{getAssigneeName(lead.assignedTo)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collaborative Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityTimeline leadId={lead.id} />
        </div>
        <div className="space-y-6">
          <CollaborativeNotes leadId={lead.id} />
          <LiveActivityFeed />
        </div>
      </div>
    </div>
  )
}
