"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const user =
    typeof window !== "undefined"
      ? localStorage.getItem("githubUser")
      : null;

  const [repoUrl, setRepoUrl] = useState("");

  if (!user) {
    router.push("/");
    return null;
  }

  const analyzeRepo = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl, user }),
    });

    const data = await res.json();
    localStorage.setItem("analysisResult", JSON.stringify(data));
    router.push("/result");
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-96 border p-8 rounded">
        <h2 className="text-xl mb-2">Hey @{user} 👋</h2>
        <p className="mb-4">Paste a public GitHub repository URL</p>

        <input
          className="border p-2 w-full mb-4"
          placeholder="https://github.com/user/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />

        <button
          onClick={analyzeRepo}
          className="bg-black text-white w-full py-2"
        >
          Analyze Repository
        </button>
      </div>
    </main>
  );
}
