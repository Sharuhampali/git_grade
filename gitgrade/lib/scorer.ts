interface RepoFile {
  path: string;
}

interface ScoreInput {
  tree: RepoFile[];
  readme: string;
  commits: unknown[];
  languages: Record<string, number>;
}

export function calculateScore(data: ScoreInput) {
  let score = 0;

  // Structure
  const fileCount = data.tree.length;
  if (fileCount > 20) score += 15;
  if (data.tree.some((f) => f.path.includes("src"))) score += 10;

  // Documentation
  if (data.readme.length > 300) score += 20;
  else if (data.readme.length > 0) score += 10;

  // Commits
  if (data.commits.length > 20) score += 15;
  else if (data.commits.length > 5) score += 8;

  // Tests
  const hasTests = data.tree.some((f) =>
    f.path.toLowerCase().includes("test")
  );
  if (hasTests) score += 15;

  // Tech stack
  if (Object.keys(data.languages).length > 1) score += 10;

  const level =
    score < 40
      ? "Beginner (Bronze)"
      : score < 70
      ? "Intermediate (Silver)"
      : score < 85
      ? "Advanced (Gold)"
      : "Expert (Platinum)";

  return { total: score, level };
}
