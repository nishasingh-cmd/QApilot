import CodeReview from "../models/CodeReview.js";
import Repository from "../models/Repository.js";
import RepositoryFile from "../models/RepositoryFile.js";
import { createReview as initReview } from "../services/codeReviewService.js";

// CREATE CODE REVIEW
export const createReview = async (req, res) => {
  try {
    const { repositoryId, fileId, scanId, reviewType = "full" } = req.body;

    if (!repositoryId || !fileId) {
      return res.status(400).json({ message: "repositoryId and fileId are required." });
    }

    // Verify repository belongs to current user
    const repo = await Repository.findOne({ _id: repositoryId, userId: req.user._id });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found or access denied." });
    }

    // Verify file belongs to repository
    const file = await RepositoryFile.findOne({ _id: fileId, repositoryId });
    if (!file) {
      return res.status(404).json({ message: "File not found inside this repository." });
    }

    // Trigger CodeReview creation & queuing
    const review = await initReview(req.user._id, {
      repositoryId,
      fileId,
      scanId,
      reviewType
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL REVIEWS FOR CURRENT USER
export const getReviews = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    
    // Optional filters
    if (req.query.repositoryId) {
      filter.repositoryId = req.query.repositoryId;
    }
    if (req.query.fileId) {
      filter.fileId = req.query.fileId;
    }

    const reviews = await CodeReview.find(filter)
      .populate("repositoryId", "name fullName htmlUrl private")
      .populate("fileId", "name path size language")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE REVIEW BY ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await CodeReview.findOne({ _id: id, userId: req.user._id })
      .populate("repositoryId")
      .populate("fileId")
      .populate("scanId");

    if (!review) {
      return res.status(404).json({ message: "Code review not found or access denied." });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE REVIEW BY ID
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await CodeReview.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!review) {
      return res.status(404).json({ message: "Code review not found or access denied." });
    }

    res.json({ message: "Code review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { createReview, getReviews, getReviewById, deleteReview };
