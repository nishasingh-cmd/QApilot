import axios from "axios";

/**
 * Fetches the complete recursive file tree from GitHub API for a given repository and branch.
 * Uses the Git Trees API.
 */
export const fetchRepositoryTree = async (owner, repo, branch, token) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "QAPilot-App"
    }
  });
  return response.data.tree || [];
};

/**
 * Fetches the binary/text content of a specific file from GitHub using its Blob SHA.
 * Decodes the returned Base64 content into UTF-8.
 */
export const fetchFileContent = async (owner, repo, sha, token) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "QAPilot-App"
    }
  });
  
  const base64Content = response.data.content || "";
  // Decode Base64 to string
  return Buffer.from(base64Content, "base64").toString("utf8");
};

export default { fetchRepositoryTree, fetchFileContent };
