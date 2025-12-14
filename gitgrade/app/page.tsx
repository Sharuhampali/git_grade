"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (!username.trim()) return;
    localStorage.setItem("githubUser", username.trim());
    router.push("/analyze");
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-96 border p-8 rounded">
        <h1 className="text-2xl font-bold mb-4">GitGrade</h1>
        <p className="mb-4">Enter your GitHub username</p>

        <input
          className="border p-2 w-full mb-4"
          placeholder="e.g. sharu-dev"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={handleContinue}
          className="bg-black text-white w-full py-2"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
