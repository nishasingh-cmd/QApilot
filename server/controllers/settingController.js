import RepositorySetting from "../models/RepositorySetting.js";

/**
 * Fetch scan and notification settings for a specific repository.
 */
export const getRepositorySettings = async (req, res) => {
  try {
    const { repoId } = req.params;
    let settings = await RepositorySetting.findOne({ repositoryId: repoId });
    if (!settings) {
      settings = await RepositorySetting.create({
        repositoryId: repoId,
        userId: req.user._id
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update scan and notification settings for a repository.
 */
export const updateRepositorySettings = async (req, res) => {
  try {
    const { repoId } = req.params;
    const settings = await RepositorySetting.findOneAndUpdate(
      { repositoryId: repoId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getRepositorySettings,
  updateRepositorySettings
};
