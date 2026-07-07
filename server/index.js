import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import findingRoutes from "./routes/findingRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import { startSyncScheduler } from "./services/syncScheduler.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/repositories", settingRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/findings", findingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/assistant", assistantRoutes);

app.get("/", (req, res) => {
  res.send("QAPilot API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start background auto sync engine scheduler
  startSyncScheduler(5);
});
