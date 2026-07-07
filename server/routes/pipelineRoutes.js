import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPipelines,
  createPipeline,
  updatePipeline,
  deletePipeline
} from "../controllers/pipelineController.js";

const router = express.Router();

router.get("/", protect, getPipelines);
router.post("/", protect, createPipeline);
router.patch("/:id", protect, updatePipeline);
router.delete("/:id", protect, deletePipeline);

export default router;
