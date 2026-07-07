import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getOrganizations,
  createOrganization,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
} from "../controllers/organizationController.js";

const router = express.Router();

router.get("/", protect, getOrganizations);
router.post("/", protect, createOrganization);
router.get("/:id", protect, getOrganizationById);
router.patch("/:id", protect, updateOrganization);
router.delete("/:id", protect, deleteOrganization);

export default router;
