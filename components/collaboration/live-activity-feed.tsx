"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WebSocketService } from "@/lib/websocket"
import { mockUsers } from "@/lib/mock-data"
import { Activity, User, MessageSquare, Edit3 } from "lucide-react"

interface LiveActivity {
  id: string
  type: "lead_created" | "lead_updated" | "activity_added" | "note_updated" | "user_login"
  userId: string
  leadId?: string
  leadName?: string
  description: string
  timestamp: Date
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<LiveActivity[]>([])

  useEffect(() => {
    // Load initial activities
    loadInitialActivities()

    // Listen for real-time activities
    const ws = WebSocketService.getInstance()
    ws.on("lead_created", handleLeadCreated)
    ws.on("lead_updated", handleLeadUpdated)
    ws.on("activity_added", handleActivityAdded)
    ws.on("note_updated", handleNoteUpdated)
    ws.on("connected", handleUserConnected)

    return () => {
      ws.off("lead_created", handleLeadCreated)
      ws.off("lead_updated", handleLeadUpdated)
      ws.off("activity_added", handleActivityAdded)
      ws.off("note_updated", handleNoteUpdated)
      ws.off("connected", handleUserConnected)
    }
  }, [])

  const loadInitialActivities = () => {
    // Mock initial activities
    const initialActivities: LiveActivity[] = [
      {
        id: "1",
        type: "lead_updated",
        userId: "3",
        leadId: "1",
        leadName: "John Smith",
        description: "Updated lead status to 'Qualified'",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: "2",
        type: "activity_added",
        userId: "2",
        leadId: "2",
        leadName: "Lisa Wang",
        description: "Added a call activity",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        id: "3",
        type: "note_updated",
        userId: "1",
        leadId: "3",
        leadName: "David Brown",
        description: "Updated collaborative notes",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        id: "4",
        type: "lead_created",
        userId: "2",
        leadId: "4",
        leadName: "New Lead",
        description: "Created a new lead",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
      },
    ]
    setActivities(initialActivities)
  }

  const handleLeadCreated = (data: any) => {
    const newActivity: LiveActivity = {
      id: Date.now().toString(),
      type: "lead_created",
      userId: data.createdBy,
      leadId: data.id,
      leadName: data.name,
      description: `Created new lead: ${data.name}`,
      timestamp: new Date(),
    }
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)]) // Keep only 20 activities
  }

  const handleLeadUpdated = (data: any) => {
    const newActivity: LiveActivity = {
      id: Date.now().toString(),
      type: "lead_updated",
      userId: data.userId,
      leadId: data.leadId,
      leadName: data.data.name,
      description: `Updated lead: ${data.data.name}`,
      timestamp: new Date(),
    }
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)])
  }

  const handleActivityAdded = (data: any) => {
    const newActivity: LiveActivity = {
      id: Date.now().toString(),
      type: "activity_added",
      userId: data.userId,
      leadId: data.activityId,
      description: `Added ${data.data.type} activity`,
      timestamp: new Date(),
    }
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)])
  }

  const handleNoteUpdated = (data: any) => {
    const newActivity: LiveActivity = {
      id: Date.now().toString(),
      type: "note_updated",
      userId: data.userId,
      leadId: data.leadId,
      description: "Updated collaborative notes",
      timestamp: new Date(),
    }
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)])
  }

  const handleUserConnected = (data: any) => {
    const newActivity: LiveActivity = {
      id: Date.now().toString(),
      type: "user_login",
      userId: data.userId,
      description: "Joined the workspace",
      timestamp: new Date(),
    }
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)])
  }

  const getActivityIcon = (type: LiveActivity["type"]) => {
    switch (type) {
      case "lead_created":
        return <User className="h-4 w-4 text-green-500" />
      case "lead_updated":
        return <Edit3 className="h-4 w-4 text-blue-500" />
      case "activity_added":
        return <Activity className="h-4 w-4 text-purple-500" />
      case "note_updated":
        return <MessageSquare className="h-4 w-4 text-orange-500" />
      case "user_login":
        return <User className="h-4 w-4 text-gray-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: LiveActivity["type"]) => {
    switch (type) {
      case "lead_created":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "lead_updated":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "activity_added":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "note_updated":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "user_login":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user?.name || "Unknown User"
  }

  const getUserAvatar = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user?.avatar
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live Activity Feed
        </CardTitle>
        <CardDescription>Real-time updates from your team</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {activities.length > 0 ? (
            <div className="space-y-1">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                    index === 0 ? "animate-slide-in" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getUserAvatar(activity.userId) || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {getUserName(activity.userId)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          <span className="font-medium">{getUserName(activity.userId)}</span>{" "}
                          <span className="text-muted-foreground">{activity.description}</span>
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className={getActivityColor(activity.type)}>{getActivityIcon(activity.type)}</Badge>
                        </div>
                      </div>
                      {activity.leadName && (
                        <p className="text-xs text-muted-foreground mt-1">Lead: {activity.leadName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
