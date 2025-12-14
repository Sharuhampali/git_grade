"use client";
interface AnalysisResult {
  score: number;
  level: string;
  summary: string;
  roadmap: string[];
}


import { useEffect, useState } from "react";

export default function ResultPage() {
    const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("analysisResult");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setResult(JSON.parse(data));
  }, []);

  if (!result) return null;

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Score: {result.score} / 100
      </h1>
      <h2 className="mb-6">{result.level}</h2>

      <h3 className="font-semibold mb-2">Summary</h3>
      <p className="mb-6">{result.summary}</p>

      <h3 className="font-semibold mb-2">Personalized Roadmap</h3>
      <ul className="list-disc ml-6">
        {result.roadmap.map((r: string, i: number) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </main>
  );
}
