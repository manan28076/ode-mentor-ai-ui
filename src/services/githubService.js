const GITHUB_API = "https://api.github.com";

async function githubFetch(path) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Not found on GitHub.");
    if (res.status === 403)
      throw new Error("GitHub API rate limit reached. Please try again later.");
    throw new Error("GitHub request failed.");
  }

  return res.json();
}

export const getUserRepos = (username) => {
  return githubFetch(`/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`);
};

export const getRepoBranches = (owner, repo) => {
  return githubFetch(`/repos/${owner}/${repo}/branches?per_page=50`);
};

export const getRepoTree = (owner, repo, branch) => {
  return githubFetch(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
};

export const getFileContent = async (owner, repo, path, branch) => {
  const data = await githubFetch(
    `/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
  );

  if (data.encoding === "base64") {
    return decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
  }

  return data.content;
};