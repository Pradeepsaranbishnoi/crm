import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { LeadList } from "@/components/leads/lead-list"

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 lg:ml-64 overflow-auto">
          <div className="container mx-auto px-4 py-8 lg:px-8">
            <LeadList />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
