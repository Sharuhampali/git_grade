interface RepoFile {
  path: string;
}

interface ScoreBreakdown {
  total: number;
}

interface AIInput {
  readme: string;
  tree: RepoFile[];
  commits: unknown[];
  languages: Record<string, number>;
  scoreBreakdown: ScoreBreakdown;
}

export function generateAIInsight(input: AIInput) {
  const { readme, tree, commits, languages, scoreBreakdown } = input;

  const fileCount = tree.length;
  const commitCount = commits.length;
  const languageCount = Object.keys(languages).length;

  const hasSrc = tree.some(f => f.path.startsWith("src/"));
  const hasTests = tree.some(f =>
    f.path.toLowerCase().includes("test")
  );

  /* ---------------- SUMMARY (DATA-DRIVEN) ---------------- */

  const summaryParts: string[] = [];

  // Code structure
  if (hasSrc && fileCount > 20) {
    summaryParts.push(
      "The repository has a well-organized structure with clear separation of source files."
    );
  } else if (fileCount > 10) {
    summaryParts.push(
      "The project structure is functional but could be better organized."
    );
  } else {
    summaryParts.push(
      "The repository has a minimal structure with limited organization."
    );
  }

  // Documentation
  if (readme.length > 300) {
    summaryParts.push(
      "Documentation is detailed and provides sufficient context for understanding the project."
    );
  } else if (readme.length > 0) {
    summaryParts.push(
      "Documentation exists but lacks depth and clarity."
    );
  } else {
    summaryParts.push(
      "The repository lacks proper documentation."
    );
  }

  // Commit practices
  if (commitCount > 20) {
    summaryParts.push(
      "Commit history shows consistent development activity."
    );
  } else if (commitCount > 5) {
    summaryParts.push(
      "Commits are present but development activity is somewhat inconsistent."
    );
  } else {
    summaryParts.push(
      "The project shows very limited commit activity."
    );
  }

  // Tech stack
  if (languageCount > 1) {
    summaryParts.push(
      "Multiple technologies are used, indicating a broader technical scope."
    );
  } else {
    summaryParts.push(
      "The project relies on a single technology stack."
    );
  }

  const summary = summaryParts.join(" ");

  /* ---------------- ROADMAP (CONDITIONAL) ---------------- */

  const roadmap: string[] = [];

  if (!readme || readme.length < 300) {
    roadmap.push(
      "Expand the README with a project overview, setup instructions, and usage examples."
    );
  }

  if (!hasTests) {
    roadmap.push(
      "Introduce unit or integration tests to improve reliability and maintainability."
    );
  }

  if (!hasSrc) {
    roadmap.push(
      "Reorganize files into a dedicated src/ directory for better maintainability."
    );
  }

  if (commitCount < 10) {
    roadmap.push(
      "Commit code more frequently with meaningful messages to reflect development progress."
    );
  }

  if (scoreBreakdown.total > 80) {
    roadmap.push(
      "Consider adding CI/CD pipelines or contributing the project to open source."
    );
  }

  /* ---------------- FINAL OUTPUT ---------------- */

  return {
    summary,
    roadmap,
  };
}
