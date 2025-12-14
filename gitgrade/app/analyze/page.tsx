"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Loader2, ArrowRight } from "lucide-react"

export default function AnalyzePage() {
  const router = useRouter()
  const [user, setUser] = useState<string | null>(null)
  const [repoUrl, setRepoUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Check for user on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("githubUser")
      if (!storedUser) {
        router.push("/login")
      } else {
        setUser(storedUser)
      }
    }
  })

  if (!user) {
    return null
  }

  const analyzeRepo = async () => {
    if (!repoUrl.trim()) return

    setIsAnalyzing(true)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, user }),
      })

      const data = await res.json()
      localStorage.setItem("analysisResult", JSON.stringify(data))
      router.push("/result")
    } catch (error) {
      console.error("Analysis failed:", error)
      setIsAnalyzing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && repoUrl.trim() && !isAnalyzing) {
      analyzeRepo()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-border/50 backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Hey, @{user} 👋</CardTitle>
                <CardDescription>Let us analyze your repository</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="repoUrl" className="text-sm font-medium">
                Repository URL
              </Label>
              <Input
                id="repoUrl"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-11"
                disabled={isAnalyzing}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">Paste any public GitHub repository URL</p>
            </div>

            <Button onClick={analyzeRepo} disabled={!repoUrl.trim() || isAnalyzing} size="lg" className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Repository...
                </>
              ) : (
                <>
                  Analyze Repository
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">Public repositories only · Read-only analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
