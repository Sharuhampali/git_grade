import { NextResponse } from "next/server";
import {
  fetchRepoMeta,
  fetchRepoTree,
  fetchReadme,
  fetchCommits,
  fetchLanguages,
} from "@/lib/github";
import { calculateScore } from "@/lib/scorer";
import { generateAIInsight } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { repoUrl, user } = await req.json();

    if (!repoUrl || !user) {
      return NextResponse.json(
        { error: "Missing repoUrl or user" },
        { status: 400 }
      );
    }

    const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

    // Fetch metadata FIRST
    const meta = await fetchRepoMeta(owner, repo);
    const branch: string = meta.default_branch;

    // Fetch repo data
    const tree = await fetchRepoTree(owner, repo, branch);
    const readme = await fetchReadme(owner, repo);
    const commits = await fetchCommits(owner, repo);
    const languages = await fetchLanguages(owner, repo);

    // Score
    const scoreBreakdown = calculateScore({
      tree,
      readme,
      commits,
      languages,
    });

    // Insight
    const ai = generateAIInsight({
      user,
      repo,
      scoreBreakdown,
      tree,
      readme,
      commits,
      languages,
    });

    // SUCCESS RESPONSE
    return NextResponse.json({
      score: scoreBreakdown.total,
      level: scoreBreakdown.level,
      summary: ai.summary,
      roadmap: ai.roadmap,

      signals: {
        fileCount: tree.length,
        commitCount: commits.length,
        readmeLength: readme.length,
        languages: Object.keys(languages),
        hasTests: tree.some((f: { path: string; }) =>
          f.path.toLowerCase().includes("test")
        ),
        hasSrcFolder: tree.some((f: { path: string; }) =>
          f.path.startsWith("src/")
        ),
      },
    });
  } catch (err) {
    console.error("Analyze API error:", err);

    // 🔴 ALWAYS return JSON on error
    return NextResponse.json(
      {
        error: "Failed to analyze repository",
        details:
          err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
