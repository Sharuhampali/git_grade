const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};

/* -------------------- Repo Metadata -------------------- */

export async function fetchRepoMeta(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch repository metadata");
  }

  return await res.json();
}

/* -------------------- Repo Tree -------------------- */

export async function fetchRepoTree(
  owner: string,
  repo: string,
  branch: string
) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  );

  if (!res.ok) return [];

  const data = await res.json();

  if (!data.tree || !Array.isArray(data.tree)) return [];

  return data.tree;
}

/* -------------------- README -------------------- */

export async function fetchReadme(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: {
        ...headers,
        Accept: "application/vnd.github.v3.raw",
      },
    }
  );

  if (!res.ok) return "";

  const text = await res.text();

  // Guard against GitHub error payloads masquerading as text
  if (text.includes("Not Found") || text.includes("documentation_url")) {
    return "";
  }

  return text;
}

/* -------------------- Commits -------------------- */

export async function fetchCommits(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
    { headers }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return Array.isArray(data) ? data : [];
}

/* -------------------- Languages -------------------- */

export async function fetchLanguages(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    { headers }
  );

  if (!res.ok) return {};

  const data = await res.json();

  // GitHub error payload guard
  if (
    typeof data !== "object" ||
    Array.isArray(data) ||
    "message" in data
  ) {
    return {};
  }

  return data as Record<string, number>;
}
