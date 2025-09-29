import type { Activity, Note } from "./types"
import { apiFetch } from "./utils"

export class ActivityService {

  // Activity methods
  static async getActivitiesByLead(leadId: string): Promise<Activity[]> {
    const data = await apiFetch<{ activities: any[]; notes: any[] }>(`/activities/lead/${leadId}`)
    return data.activities.map((a) => ({ ...a, createdAt: new Date(a.createdAt), completedAt: a.completedAt ? new Date(a.completedAt) : undefined })) as Activity[]
  }

  static async createActivity(activity: Omit<Activity, "id" | "createdAt">): Promise<Activity> {
    const payload = { ...activity, type: activity.type.toUpperCase() }
    const a = await apiFetch<any>(`/activities`, { method: "POST", body: JSON.stringify(payload) })
    return { ...a, createdAt: new Date(a.createdAt), completedAt: a.completedAt ? new Date(a.completedAt) : undefined } as Activity
  }

  static async updateActivity(_id: string, _updates: Partial<Activity>): Promise<Activity | null> {
    return null
  }

  static async deleteActivity(_id: string): Promise<boolean> {
    return true
  }

  // Notes methods
  static async getNotesByLead(leadId: string): Promise<Note[]> {
    const data = await apiFetch<{ activities: any[]; notes: any[] }>(`/activities/lead/${leadId}`)
    return data.notes.map((n) => ({ ...n, createdAt: new Date(n.createdAt), updatedAt: new Date(n.updatedAt) })) as Note[]
  }

  static async createNote(note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    const created = await apiFetch<any>(`/activities/note`, { method: "POST", body: JSON.stringify(note) })
    return { ...created, createdAt: new Date(created.createdAt), updatedAt: new Date(created.updatedAt) } as Note
  }

  static async updateNote(_id: string, _updates: Partial<Note>): Promise<Note | null> {
    return null
  }

  static async deleteNote(_id: string): Promise<boolean> {
    return true
  }

  // Combined timeline
  static async getTimelineByLead(leadId: string): Promise<(Activity | Note)[]> {
    const data = await apiFetch<{ activities: any[]; notes: any[] }>(`/activities/lead/${leadId}`)
    const activities: Activity[] = data.activities.map((a) => ({ ...a, createdAt: new Date(a.createdAt), completedAt: a.completedAt ? new Date(a.completedAt) : undefined }))
    const notes: Note[] = data.notes.map((n) => ({ ...n, createdAt: new Date(n.createdAt), updatedAt: new Date(n.updatedAt) }))
    const timeline = [...activities, ...notes]
    return timeline.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}
