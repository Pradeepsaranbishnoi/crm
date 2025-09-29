"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { WebSocketService } from "@/lib/websocket"
import { mockUsers } from "@/lib/mock-data"
import { useAuth } from "@/components/auth/auth-provider"
import { Save, Users, Edit3, Eye } from "lucide-react"

interface CollaborativeNote {
  id: string
  leadId: string
  content: string
  lastEditedBy: string
  lastEditedAt: Date
  collaborators: string[]
  isEditing: boolean
  editingBy?: string
}

interface CollaborativeNotesProps {
  leadId: string
}

export function CollaborativeNotes({ leadId }: CollaborativeNotesProps) {
  const [note, setNote] = useState<CollaborativeNote | null>(null)
  const [content, setContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeCollaborators, setActiveCollaborators] = useState<string[]>([])
  const { user } = useAuth()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadNote()

    // Listen for real-time collaboration events
    const ws = WebSocketService.getInstance()
    ws.on("note_updated", handleNoteUpdate)
    ws.on("user_editing", handleUserEditing)
    ws.on("user_stopped_editing", handleUserStoppedEditing)

    return () => {
      ws.off("note_updated", handleNoteUpdate)
      ws.off("user_editing", handleUserEditing)
      ws.off("user_stopped_editing", handleUserStoppedEditing)
    }
  }, [leadId])

  useEffect(() => {
    if (note) {
      setContent(note.content)
    }
  }, [note])

  const loadNote = () => {
    // Mock note data - in production, this would come from the backend
    const mockNote: CollaborativeNote = {
      id: `note-${leadId}`,
      leadId,
      content:
        "Initial discussion notes:\n\n• Client is interested in enterprise package\n• Budget confirmed at $50,000\n• Decision timeline: End of Q1\n• Key stakeholders: John (CTO), Sarah (CFO)\n\nNext steps:\n- Schedule technical demo\n- Prepare custom proposal\n- Follow up next week",
      lastEditedBy: "2",
      lastEditedAt: new Date(Date.now() - 10 * 60 * 1000),
      collaborators: ["1", "2", "3"],
      isEditing: false,
    }
    setNote(mockNote)
  }

  const handleNoteUpdate = (data: { leadId: string; content: string; userId: string }) => {
    if (data.leadId === leadId && data.userId !== user?.id) {
      setNote((prev) =>
        prev
          ? {
              ...prev,
              content: data.content,
              lastEditedBy: data.userId,
              lastEditedAt: new Date(),
            }
          : null,
      )
      setContent(data.content)
    }
  }

  const handleUserEditing = (data: { leadId: string; userId: string }) => {
    if (data.leadId === leadId && data.userId !== user?.id) {
      setActiveCollaborators((prev) => [...prev.filter((id) => id !== data.userId), data.userId])
      setNote((prev) => (prev ? { ...prev, isEditing: true, editingBy: data.userId } : null))
    }
  }

  const handleUserStoppedEditing = (data: { leadId: string; userId: string }) => {
    if (data.leadId === leadId) {
      setActiveCollaborators((prev) => prev.filter((id) => id !== data.userId))
      setNote((prev) => (prev ? { ...prev, isEditing: false, editingBy: undefined } : null))
    }
  }

  const startEditing = () => {
    setIsEditing(true)
    // Notify other users that we're editing
    WebSocketService.getInstance().emit("user_editing", { leadId, userId: user?.id })

    // Focus the textarea
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  const stopEditing = () => {
    setIsEditing(false)
    WebSocketService.getInstance().emit("user_stopped_editing", { leadId, userId: user?.id })
  }

  const saveNote = async () => {
    if (!note || !user) return

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedNote = {
        ...note,
        content,
        lastEditedBy: user.id,
        lastEditedAt: new Date(),
      }
      setNote(updatedNote)

      // Emit real-time update
      WebSocketService.getInstance().emit("note_updated", {
        leadId,
        content,
        userId: user.id,
      })

      stopEditing()
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const cancelEditing = () => {
    setContent(note?.content || "")
    stopEditing()
  }

  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user?.name || "Unknown User"
  }

  const getUserAvatar = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user?.avatar
  }

  if (!note) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading notes...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Collaborative Notes
            </CardTitle>
            <CardDescription>
              Last edited by {getUserName(note.lastEditedBy)} • {new Date(note.lastEditedAt).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Active collaborators */}
            {activeCollaborators.length > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {activeCollaborators.slice(0, 3).map((userId) => (
                    <Avatar key={userId} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={getUserAvatar(userId) || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {getUserName(userId)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {activeCollaborators.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{activeCollaborators.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Collaborators count */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{note.collaborators.length}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add your notes here..."
              className="min-h-[200px] resize-none"
              disabled={isSaving}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {note.isEditing && note.editingBy && note.editingBy !== user?.id && (
                  <Badge variant="outline" className="text-xs">
                    {getUserName(note.editingBy)} is also editing
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={cancelEditing} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={saveNote} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg">
              {content ? (
                <pre className="whitespace-pre-wrap text-sm font-sans">{content}</pre>
              ) : (
                <p className="text-muted-foreground text-sm">No notes yet. Click Edit to add notes.</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                {note.collaborators.map((userId) => (
                  <Avatar key={userId} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={getUserAvatar(userId) || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {getUserName(userId)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button onClick={startEditing} disabled={note.isEditing && note.editingBy !== user?.id}>
                {note.isEditing && note.editingBy !== user?.id ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    {getUserName(note.editingBy)} is editing
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Notes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
