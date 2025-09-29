"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { mockUsers, mockLeads } from "@/lib/mock-data"

export function TopPerformers() {
  // Calculate performance metrics for each user
  const userPerformance = mockUsers
    .map((user) => {
      const userLeads = mockLeads.filter((lead) => lead.assignedTo === user.id)
      const closedWon = userLeads.filter((lead) => lead.status === "closed_won").length
      const totalClosed = userLeads.filter(
        (lead) => lead.status === "closed_won" || lead.status === "closed_lost",
      ).length
      const winRate = totalClosed > 0 ? (closedWon / totalClosed) * 100 : 0
      const totalValue = userLeads
        .filter((lead) => lead.status === "closed_won")
        .reduce((sum, lead) => sum + (lead.value || 0), 0)

      return {
        ...user,
        totalLeads: userLeads.length,
        closedWon,
        winRate,
        totalValue,
      }
    })
    .filter((user) => user.totalLeads > 0)
    .sort((a, b) => b.totalValue - a.totalValue)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          Top Performers
        </CardTitle>
        <CardDescription>Leading sales team members this period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userPerformance.map((user, index) => (
            <div key={user.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">🏆</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${user.totalValue.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-green-500">📈</span>
                      <span className="text-xs text-green-500">{user.winRate.toFixed(0)}% win rate</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {user.closedWon} won of {user.totalLeads} leads
                    </span>
                    <span>{user.winRate.toFixed(0)}%</span>
                  </div>
                  <Progress value={user.winRate} className="h-1" />
                </div>
              </div>
            </div>
          ))}

          {userPerformance.length === 0 && (
            <div className="text-center py-8">
              <span className="text-2xl">🏆</span>
              <p className="text-sm text-muted-foreground mt-2">No performance data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
