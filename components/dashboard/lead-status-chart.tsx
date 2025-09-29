"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Lead } from "@/lib/types"

interface LeadStatusChartProps {
  statusData: Record<Lead["status"], number>
}

const statusColors = {
  new: "#3b82f6",
  contacted: "#8b5cf6",
  qualified: "#10b981",
  proposal: "#f59e0b",
  negotiation: "#ef4444",
  closed_won: "#22c55e",
  closed_lost: "#dc2626",
}

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
}

export function LeadStatusChart({ statusData }: LeadStatusChartProps) {
  const chartData = Object.entries(statusData)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      status: statusLabels[status as Lead["status"]],
      count,
      color: statusColors[status as Lead["status"]],
    }))

  const total = chartData.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Status Distribution</CardTitle>
        <CardDescription>Current status breakdown of all leads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item, index) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-muted-foreground">
                    {item.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        {total === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-2xl">📊</span>
            <p className="mt-2">No lead data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
