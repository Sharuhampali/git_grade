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
  const { repoUrl, user } = await req.json();
  const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

  const meta = await fetchRepoMeta(owner, repo);
  const tree = await fetchRepoTree(owner, repo);
  const readme = await fetchReadme(owner, repo);
  const commits = await fetchCommits(owner, repo);
  const languages = await fetchLanguages(owner, repo);

  const scoreBreakdown = calculateScore({
    meta,
    tree,
    readme,
    commits,
    languages,
  });

  const ai = await generateAIInsight({
    user,
    repo,
    scoreBreakdown,
    tree,
    readme,
    commits,
    languages,
  });

  return NextResponse.json({
    score: scoreBreakdown.total,
    level: scoreBreakdown.level,
    summary: ai.summary,
    roadmap: ai.roadmap,
  });
}
