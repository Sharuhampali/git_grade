const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
};

export async function fetchRepoMeta(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );
  return await res.json();
}

export async function fetchRepoTree(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
    { headers }
  );
  const data = await res.json();
  return data.tree || [];
}

export async function fetchReadme(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    { headers: { ...headers, Accept: "application/vnd.github.v3.raw" } }
  );
  if (!res.ok) return "";
  return await res.text();
}

export async function fetchCommits(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
    { headers }
  );
  return await res.json();
}

export async function fetchLanguages(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    { headers }
  );
  return await res.json();
}
