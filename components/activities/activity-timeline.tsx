"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, Mail, MessageSquare, Calendar, Plus, Clock } from "lucide-react"
import { ActivityService } from "@/lib/activity-service"
import { UserService } from "@/lib/user-service"
import { AuthService } from "@/lib/auth"
import type { Activity, Note } from "@/lib/types"

interface ActivityTimelineProps {
  leadId: string
}

export function ActivityTimeline({ leadId }: ActivityTimelineProps) {
  const [timeline, setTimeline] = useState<(Activity | Note)[]>([])
  const [usersData, setUsersData] = useState<any[]>([])
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newActivity, setNewActivity] = useState({
    type: "call" as Activity["type"],
    title: "",
    description: "",
  })
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    loadTimeline()
    loadUsers()
  }, [leadId])

  const loadTimeline = async () => {
    const timelineData = await ActivityService.getTimelineByLead(leadId)
    setTimeline(timelineData)
  }

  const loadUsers = async () => {
    const usersData = await UserService.getAllUsers()
    setUsersData(usersData)
  }

  const handleAddActivity = async () => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || !newActivity.title.trim()) return

    await ActivityService.createActivity({
      leadId,
      userId: currentUser.id,
      type: newActivity.type,
      title: newActivity.title,
      description: newActivity.description,
      completedAt: new Date(),
    })

    setNewActivity({ type: "call", title: "", description: "" })
    setIsAddingActivity(false)
    loadTimeline()
  }

  const handleAddNote = async () => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || !newNote.trim()) return

    await ActivityService.createNote({
      leadId,
      userId: currentUser.id,
      content: newNote,
      isCollaborative: false,
    })

    setNewNote("")
    setIsAddingNote(false)
    loadTimeline()
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "meeting":
        return <Calendar className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "call":
        return "bg-blue-500"
      case "email":
        return "bg-green-500"
      case "meeting":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getUserById = (userId: string) => {
    return usersData.find((user) => user.id === userId)
  }

  const isActivity = (item: Activity | Note): item is Activity => {
    return "type" in item
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="activity-type">Type</Label>
                    <Select
                      value={newActivity.type}
                      onValueChange={(value: Activity["type"]) => setNewActivity({ ...newActivity, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="activity-title">Title</Label>
                    <Input
                      id="activity-title"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                      placeholder="Activity title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="activity-description">Description</Label>
                    <Textarea
                      id="activity-description"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      placeholder="Activity description"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingActivity(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddActivity}>Add Activity</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="note-content">Note</Label>
                    <Textarea
                      id="note-content"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add your note here..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddNote}>Add Note</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {timeline.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activities or notes yet</p>
                <p className="text-sm">Add your first activity or note to get started</p>
              </div>
            ) : (
              timeline.map((item) => {
                const user = getUserById(item.userId)
                const isActivityItem = isActivity(item)

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          isActivityItem ? getActivityColor(item.type) : "bg-orange-500"
                        }`}
                      >
                        {isActivityItem ? getActivityIcon(item.type) : <MessageSquare className="h-4 w-4" />}
                      </div>
                      {timeline.indexOf(item) < timeline.length - 1 && <div className="w-px h-16 bg-border mt-2" />}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{user?.name}</span>
                            {isActivityItem && (
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                        </div>
                        {isActivityItem ? (
                          <div>
                            <h4 className="font-medium mb-1">{item.title}</h4>
                            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                          </div>
                        ) : (
                          <p className="text-sm">{item.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
