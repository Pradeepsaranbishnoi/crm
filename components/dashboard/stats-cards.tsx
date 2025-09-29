"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const conversionPercentage = stats.totalLeads > 0 ? (stats.closedWon / stats.totalLeads) * 100 : 0
  const winRate =
    stats.closedWon + stats.closedLost > 0 ? (stats.closedWon / (stats.closedWon + stats.closedLost)) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <span className="text-base">👥</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLeads}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {stats.newLeads} new
            </Badge>
            <span>this period</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <span className="text-base">🎯</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionPercentage.toFixed(1)}%</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {conversionPercentage > 15 ? (
              <span className="text-green-500">📈</span>
            ) : (
              <span className="text-red-500">📉</span>
            )}
            <span>{conversionPercentage > 15 ? "Above" : "Below"} average</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <span className="text-base">💰</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span className="text-green-500">📈</span>
            <span>+12% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <span className="text-base">📊</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {stats.closedWon} won
            </Badge>
            <span>of {stats.closedWon + stats.closedLost} closed</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
