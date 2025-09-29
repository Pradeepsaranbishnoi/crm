"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserService } from "@/lib/user-service"
import { LeadService } from "@/lib/lead-service"
import { Users, TrendingUp, Award, Activity } from "lucide-react"
import type { User } from "@/lib/types"

interface TeamMemberStats {
  user: User
  totalLeads: number
  closedWon: number
  winRate: number
  totalValue: number
}

export function TeamOverview() {
  const [teamStats, setTeamStats] = useState<TeamMemberStats[]>([])
  const [userStats, setUserStats] = useState({
    total: 0,
    byRole: { admin: 0, manager: 0, sales_rep: 0 },
    active: 0,
  })

  useEffect(() => {
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    try {
      const users = await UserService.getUsers()
      const leads = await LeadService.getLeads()
      const stats = UserService.getUserStats()

      // Calculate performance for each team member
      const teamPerformance = users.map((user) => {
        const userLeads = leads.filter((lead) => lead.assignedTo === user.id)
        const closedWon = userLeads.filter((lead) => lead.status === "closed_won").length
        const totalClosed = userLeads.filter(
          (lead) => lead.status === "closed_won" || lead.status === "closed_lost",
        ).length
        const winRate = totalClosed > 0 ? (closedWon / totalClosed) * 100 : 0
        const totalValue = userLeads
          .filter((lead) => lead.status === "closed_won")
          .reduce((sum, lead) => sum + (lead.value || 0), 0)

        return {
          user,
          totalLeads: userLeads.length,
          closedWon,
          winRate,
          totalValue,
        }
      })

      setTeamStats(teamPerformance.sort((a, b) => b.totalValue - a.totalValue))
      setUserStats(stats)
    } catch (error) {
      console.error("Error loading team data:", error)
    }
  }

  const roleColors = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    sales_rep: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }

  return (
    <div className="space-y-6">
      {/* Team Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground">{userStats.active} active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.byRole.admin}</div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.byRole.manager}</div>
            <p className="text-xs text-muted-foreground">Team managers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Reps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.byRole.sales_rep}</div>
            <p className="text-xs text-muted-foreground">Sales representatives</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Individual performance metrics for team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamStats.map((member, index) => (
              <div key={member.user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && member.totalValue > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Award className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={roleColors[member.user.role]}>
                        {member.user.role === "sales_rep" ? "Sales Rep" : member.user.role}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{member.user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium">${member.totalValue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.totalLeads}</p>
                      <p className="text-xs text-muted-foreground">Total Leads</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.winRate.toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {teamStats.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No team performance data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
