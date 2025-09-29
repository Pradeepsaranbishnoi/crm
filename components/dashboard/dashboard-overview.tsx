"use client"

import { useState, useEffect } from "react"
import { LeadService } from "@/lib/lead-service"
import { StatsCards } from "./stats-cards"
import { LeadStatusChart } from "./lead-status-chart"
import { PriorityChart } from "./priority-chart"
import { RecentActivity } from "./recent-activity"
import { TopPerformers } from "./top-performers"
import type { DashboardStats } from "@/lib/types"

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    closedWon: 0,
    closedLost: 0,
    totalValue: 0,
    conversionRate: 0,
    averageDealSize: 0,
  })
  const [leadStats, setLeadStats] = useState({
    byStatus: {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      closed_won: 0,
      closed_lost: 0,
    },
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
    },
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const leads = await LeadService.getLeads()
      const leadStatsData = LeadService.getLeadStats()

      // Calculate dashboard statistics
      const totalValue = leads
        .filter((lead) => lead.status === "closed_won")
        .reduce((sum, lead) => sum + (lead.value || 0), 0)

      const closedWon = leads.filter((lead) => lead.status === "closed_won").length
      const closedLost = leads.filter((lead) => lead.status === "closed_lost").length
      const newLeads = leads.filter((lead) => lead.status === "new").length
      const qualifiedLeads = leads.filter((lead) => lead.status === "qualified").length

      const conversionRate = leads.length > 0 ? (closedWon / leads.length) * 100 : 0
      const averageDealSize = closedWon > 0 ? totalValue / closedWon : 0

      setStats({
        totalLeads: leads.length,
        newLeads,
        qualifiedLeads,
        closedWon,
        closedLost,
        totalValue,
        conversionRate,
        averageDealSize,
      })

      setLeadStats({
        byStatus: leadStatsData.byStatus,
        byPriority: leadStatsData.byPriority,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your sales performance and team metrics</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <LeadStatusChart statusData={leadStats.byStatus} />
        <PriorityChart priorityData={leadStats.byPriority} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <TopPerformers />
      </div>
    </div>
  )
}
