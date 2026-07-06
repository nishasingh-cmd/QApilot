import Repository from "../models/Repository.js";

export const saveRepositories = async (repos, userId) => {
  const formatted = repos.map((repo) => ({
    githubId: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    htmlUrl: repo.html_url,
    description: repo.description,
    language: repo.language,
    defaultBranch: repo.default_branch,
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url
    },
    userId
  }));

  // remove old + replace (sync behavior)
  await Repository.deleteMany({ userId });

  const saved = await Repository.insertMany(formatted);

  return saved;
};

export const getUserRepositories = async (userId) => {
  return await Repository.find({ userId });
};

export default { saveRepositories, getUserRepositories };
