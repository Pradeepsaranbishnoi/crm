import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { UserList } from "@/components/users/user-list"
import { RolePermissions } from "@/components/users/role-permissions"
import { TeamOverview } from "@/components/users/team-overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <ProtectedRoute requiredRoles={["admin", "manager"]}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 lg:ml-64 overflow-auto">
          <div className="container mx-auto px-4 py-8 lg:px-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-balance">Settings</h1>
                <p className="text-muted-foreground">Manage your team, roles, and system settings</p>
              </div>

              <Tabs defaultValue="users" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="users">User Management</TabsTrigger>
                  <TabsTrigger value="roles">Role Permissions</TabsTrigger>
                  <TabsTrigger value="team">Team Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-6">
                  <UserList />
                </TabsContent>

                <TabsContent value="roles" className="space-y-6">
                  <RolePermissions />
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                  <TeamOverview />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
