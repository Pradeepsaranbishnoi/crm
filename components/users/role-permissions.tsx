"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserService } from "@/lib/user-service"
import { Shield, Check, X, Users, Settings, BarChart3, Trash2, UserPlus, Edit } from "lucide-react"
import type { User } from "@/lib/types"

const roleDescriptions = {
  admin: "Full system access with all administrative privileges",
  manager: "Team leadership with reporting and lead management capabilities",
  sales_rep: "Individual contributor focused on assigned leads and activities",
}

const permissionLabels = {
  canManageUsers: "Manage Users",
  canManageAllLeads: "Manage All Leads",
  canViewReports: "View Reports",
  canManageSettings: "Manage Settings",
  canDeleteLeads: "Delete Leads",
  canAssignLeads: "Assign Leads",
}

const permissionIcons = {
  canManageUsers: Users,
  canManageAllLeads: Edit,
  canViewReports: BarChart3,
  canManageSettings: Settings,
  canDeleteLeads: Trash2,
  canAssignLeads: UserPlus,
}

export function RolePermissions() {
  const roles: User["role"][] = ["admin", "manager", "sales_rep"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-balance">Role Permissions</h2>
        <p className="text-muted-foreground">Overview of permissions for each role in the system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role) => {
          const permissions = UserService.getRolePermissions(role)
          const roleColor = {
            admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            sales_rep: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          }[role]

          return (
            <Card key={role}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 capitalize">
                    <Shield className="h-5 w-5" />
                    {role.replace("_", " ")}
                  </CardTitle>
                  <Badge className={roleColor}>{role === "sales_rep" ? "Sales Rep" : role}</Badge>
                </div>
                <CardDescription>{roleDescriptions[role]}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(permissions).map(([permission, hasPermission]) => {
                    const Icon = permissionIcons[permission as keyof typeof permissionIcons]
                    return (
                      <div key={permission} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {permissionLabels[permission as keyof typeof permissionLabels]}
                          </span>
                        </div>
                        {hasPermission ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
