import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceAccess } from "../middleware/roleMiddleware.js";
import { getInvoices, getInvoiceById } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/", protect, requireWorkspaceAccess, getInvoices);
router.get("/:id", protect, requireWorkspaceAccess, getInvoiceById);

export default router;
