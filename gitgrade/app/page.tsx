"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Github } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleContinue = () => {
    if (!username.trim()) return
    localStorage.setItem("githubUser", username.trim())
    router.push("/analyze")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && username.trim()) {
      handleContinue()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-border/50 backdrop-blur">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Github className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">Welcome to GitGrade</CardTitle>
              <CardDescription className="text-base">
                Get an honest evaluation of your GitHub repositories
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                GitHub Username
              </Label>
              <Input
                id="username"
                placeholder="octocat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-11"
                autoFocus
              />
            </div>

            <Button onClick={handleContinue} disabled={!username.trim()} size="lg" className="w-full">
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </CardContent>

          <CardFooter className="flex-col space-y-2 border-t pt-6">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Public repositories only · Read-only access · No credentials stored
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
