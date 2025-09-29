"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { mockLeads, mockUsers, mockActivities } from "@/lib/mock-data"

const activityIcons = {
  call: "📞",
  email: "📧",
  note: "💬",
  meeting: "📅",
  task: "👤",
}

export function RecentActivity() {
  // Get recent activities with lead and user information
  const recentActivities = mockActivities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((activity) => {
      const lead = mockLeads.find((l) => l.id === activity.leadId)
      const user = mockUsers.find((u) => u.id === activity.userId)
      return { ...activity, lead, user }
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest interactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const icon = activityIcons[activity.type]
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm">{icon}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={activity.user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {activity.user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {activity.user?.name} • {activity.lead?.name}
                    </span>
                  </div>
                  {activity.description && <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.createdAt).toLocaleDateString()} at{" "}
                    {new Date(activity.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })}

          {recentActivities.length === 0 && (
            <div className="text-center py-8">
              <span className="text-2xl">💬</span>
              <p className="text-sm text-muted-foreground mt-2">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
