"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Lead } from "@/lib/types"

interface PriorityChartProps {
  priorityData: Record<Lead["priority"], number>
}

export function PriorityChart({ priorityData }: PriorityChartProps) {
  const chartData = [
    {
      priority: "High",
      count: priorityData.high,
      color: "#dc2626",
      emoji: "🔴",
    },
    {
      priority: "Medium",
      count: priorityData.medium,
      color: "#f59e0b",
      emoji: "🟡",
    },
    {
      priority: "Low",
      count: priorityData.low,
      color: "#6b7280",
      emoji: "⚪",
    },
  ]

  const maxCount = Math.max(...chartData.map((item) => item.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Priority Breakdown</CardTitle>
        <CardDescription>Distribution of leads by priority level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {chartData.map((item, index) => {
            const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{item.emoji}</span>
                    <span className="font-medium">{item.priority}</span>
                  </div>
                  <span className="text-muted-foreground">{item.count} leads</span>
                </div>
                <div className="flex items-end h-16">
                  <div
                    className="w-full rounded-t transition-all duration-300"
                    style={{
                      height: `${height}%`,
                      backgroundColor: item.color,
                      minHeight: item.count > 0 ? "8px" : "0px",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        {maxCount === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-2xl">📊</span>
            <p className="mt-2">No priority data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
