import Pipeline from "../models/Pipeline.js";

/**
 * Fetch CI/CD pipeline triggers. Seeds default if empty.
 */
export const getPipelines = async (req, res) => {
  try {
    const { repositoryId } = req.query;
    if (!repositoryId) {
      const list = await Pipeline.find({}).populate("repositoryId");
      return res.json(list);
    }

    let pipeline = await Pipeline.findOne({ repositoryId });
    if (!pipeline) {
      pipeline = await Pipeline.create({
        name: "Default Deploy Workflow",
        repositoryId,
        triggerEvent: "push",
        stages: ["Install Dependencies", "Run Tests", "Build Project", "Deploy"]
      });
    }

    res.json([pipeline]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create pipeline configuration.
 */
export const createPipeline = async (req, res) => {
  try {
    const doc = await Pipeline.create(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Edit pipeline configuration parameters.
 */
export const updatePipeline = async (req, res) => {
  try {
    const doc = await Pipeline.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete pipeline configuration.
 */
export const deletePipeline = async (req, res) => {
  try {
    await Pipeline.findByIdAndDelete(req.params.id);
    res.json({ message: "CI/CD configuration deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getPipelines,
  createPipeline,
  updatePipeline,
  deletePipeline
};
