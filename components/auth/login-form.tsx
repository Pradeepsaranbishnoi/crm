"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthService } from "@/lib/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await AuthService.login(email, password)
      if (result) {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const quickFill = (which: "admin" | "manager" | "sales") => {
    const map = {
      admin: "admin@crm.com",
      manager: "manager@crm.com",
      sales: "sales@crm.com",
    } as const
    setEmail(map[which])
    setPassword("password")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <span className="text-2xl text-primary-foreground">🏢</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to CRM Pro</CardTitle>
          <CardDescription>Sign in to your account to manage leads and collaborate with your team</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Admin:</strong> admin@crm.com / password
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 ml-2"
                  onClick={() => quickFill("admin")}
                  disabled={isLoading}
                >
                  Use
                </Button>
              </p>
              <p>
                <strong>Manager:</strong> manager@crm.com / password
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 ml-2"
                  onClick={() => quickFill("manager")}
                  disabled={isLoading}
                >
                  Use
                </Button>
              </p>
              <p>
                <strong>Sales Rep:</strong> sales@crm.com / password
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 ml-2"
                  onClick={() => quickFill("sales")}
                  disabled={isLoading}
                >
                  Use
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
