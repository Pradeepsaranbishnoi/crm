"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WebSocketService } from "@/lib/websocket"
import { mockUsers } from "@/lib/mock-data"
import { useAuth } from "@/components/auth/auth-provider"

interface Notification {
  id: string
  type: "lead_updated" | "activity_added" | "note_added" | "user_mention"
  title: string
  message: string
  userId: string
  leadId?: string
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Listen for real-time notifications
    const ws = WebSocketService.getInstance()

    ws.on("lead_updated", handleLeadUpdate)
    ws.on("activity_added", handleActivityAdded)
    ws.on("note_added", handleNoteAdded)
    ws.on("user_mention", handleUserMention)

    // Load existing notifications (mock data)
    loadNotifications()

    return () => {
      ws.off("lead_updated", handleLeadUpdate)
      ws.off("activity_added", handleActivityAdded)
      ws.off("note_added", handleNoteAdded)
      ws.off("user_mention", handleUserMention)
    }
  }, [])

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length
    setUnreadCount(unread)
  }, [notifications])

  const loadNotifications = () => {
    // Mock notifications - in production, these would come from the backend
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "lead_updated",
        title: "Lead Status Updated",
        message: "John Smith's lead status changed to 'Qualified'",
        userId: "2",
        leadId: "1",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
      },
      {
        id: "2",
        type: "activity_added",
        title: "New Activity Added",
        message: "Emily Rodriguez added a call activity for Lisa Wang",
        userId: "3",
        leadId: "2",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
      },
      {
        id: "3",
        type: "note_added",
        title: "Collaborative Note Updated",
        message: "Mike Chen added notes to David Brown's lead",
        userId: "2",
        leadId: "3",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: true,
      },
    ]
    setNotifications(mockNotifications)
  }

  const handleLeadUpdate = (data: any) => {
    if (data.userId === user?.id) return // Don't notify self

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "lead_updated",
      title: "Lead Updated",
      message: `Lead ${data.data.name} was updated`,
      userId: data.userId,
      leadId: data.leadId,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const handleActivityAdded = (data: any) => {
    if (data.userId === user?.id) return

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "activity_added",
      title: "New Activity",
      message: `New ${data.data.type} activity added`,
      userId: data.userId,
      leadId: data.data.leadId,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const handleNoteAdded = (data: any) => {
    if (data.userId === user?.id) return

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "note_added",
      title: "Note Added",
      message: "A collaborative note was updated",
      userId: data.userId,
      leadId: data.leadId,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const handleUserMention = (data: any) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "user_mention",
      title: "You were mentioned",
      message: data.message,
      userId: data.userId,
      leadId: data.leadId,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "lead_updated":
        return <span className="text-sm">👤</span>
      case "activity_added":
        return <span className="text-sm">📈</span>
      case "note_added":
        return <span className="text-sm">💬</span>
      case "user_mention":
        return <span className="text-sm">🔔</span>
      default:
        return <span className="text-sm">🔔</span>
    }
  }

  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user?.name || "Unknown User"
  }

  const getUserAvatar = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user?.avatar
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <span className="text-base">🔔</span>
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
            <CardDescription>
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={getUserAvatar(notification.userId) || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {getUserName(notification.userId)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <div className="flex items-center space-x-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <span className="text-xs">✓</span>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <span className="text-xs">✕</span>
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex items-center space-x-1">
                              {getNotificationIcon(notification.type)}
                              <span className="text-xs text-muted-foreground">{getUserName(notification.userId)}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <span className="text-2xl">🔔</span>
                  <p className="text-sm text-muted-foreground mt-2">No notifications yet</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
