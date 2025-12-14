"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  FileCode,
  GitCommit,
  FileText,
  TestTube,
  FolderOpen,
  Code2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react"

interface RepoSignals {
  fileCount: number
  commitCount: number
  readmeLength: number
  languages: string[]
  hasTests: boolean
  hasSrcFolder: boolean
}

interface AnalysisResult {
  score: number
  level: string
  summary: string
  roadmap?: string[]
  signals?: RepoSignals
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("analysisResult")
      if (!data) {
        router.push("/analyze")
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResult(JSON.parse(data) as AnalysisResult)
      }
    }
  }, [router])

  if (!result) return null

  const signals = result.signals

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-orange-600 dark:text-orange-400"
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "outline"
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/analyze")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Analyze Another
          </Button>
        </div>

        {/* Score Card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardDescription>Repository Score</CardDescription>
                <CardTitle className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                  <span className="text-3xl text-muted-foreground">/100</span>
                </CardTitle>
              </div>
              <Badge variant={getScoreBadgeVariant(result.score)} className="text-sm px-4 py-2">
                {result.level}
              </Badge>
            </div>
            <Progress value={result.score} className="h-3" />
          </CardHeader>

          <CardContent>
            <p className="text-base text-foreground leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>

        {/* Repository Insights */}
        {signals && (
          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Repository Insights
              </CardTitle>
              <CardDescription>Key metrics and indicators from your repository</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCode className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Total Files</p>
                    <p className="text-xl font-semibold">{signals.fileCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GitCommit className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Commits</p>
                    <p className="text-xl font-semibold">{signals.commitCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">README Length</p>
                    <p className="text-xl font-semibold">{signals.readmeLength} chars</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TestTube className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Tests Present</p>
                    <p className="text-xl font-semibold">{signals.hasTests ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">src/ Folder</p>
                    <p className="text-xl font-semibold">{signals.hasSrcFolder ? "Present" : "Missing"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Tech Stack</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {signals.languages.map((lang, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personalized Roadmap */}
        {Array.isArray(result.roadmap) && result.roadmap.length > 0 && (
          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Personalized Roadmap
              </CardTitle>
              <CardDescription>Steps to improve your repository quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.roadmap.map((step, index) => (
                  <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
