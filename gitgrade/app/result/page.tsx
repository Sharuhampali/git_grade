"use client";

import { useState } from "react";

/* -------------------- Types -------------------- */

interface RepoSignals {
  fileCount: number;
  commitCount: number;
  readmeLength: number;
  languages: string[];
  hasTests: boolean;
  hasSrcFolder: boolean;
}

interface AnalysisResult {
  score: number;
  level: string;
  summary: string;
  roadmap?: string[];
  signals?: RepoSignals;
}

/* -------------------- Component -------------------- */

export default function ResultPage() {
  const [result] = useState<AnalysisResult | null>(() => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("analysisResult");
    return data ? (JSON.parse(data) as AnalysisResult) : null;
  });

  if (!result) return null;

  const signals = result.signals;

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Score: {result.score} / 100
      </h1>
      <h2 className="mb-6">{result.level}</h2>

      <h3 className="font-semibold mb-2">Summary</h3>
      <p className="mb-6">{result.summary}</p>

      {signals && (
        <>
          <h3 className="font-semibold mt-8 mb-3">
            Repository Insights
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm border p-4 rounded mb-8">
            <div>📁 Total Files</div>
            <div>{signals.fileCount}</div>

            <div>🧠 Commits</div>
            <div>{signals.commitCount}</div>

            <div>🧾 README Length</div>
            <div>{signals.readmeLength} characters</div>

            <div>🧪 Tests Present</div>
            <div>{signals.hasTests ? "Yes" : "No"}</div>

            <div>📦 src/ Folder</div>
            <div>{signals.hasSrcFolder ? "Present" : "Missing"}</div>

            <div>🛠 Tech Stack</div>
            <div>{signals.languages.join(", ")}</div>
          </div>
        </>
      )}

      {Array.isArray(result.roadmap) && result.roadmap.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">
            Personalized Roadmap
          </h3>
          <ul className="list-disc ml-6">
            {result.roadmap.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
