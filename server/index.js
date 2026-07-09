import "dotenv/config";

const requiredEnv = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "JWT_SECRET",
  "FRONTEND_URL",
  "BACKEND_URL"
];

for (const key of requiredEnv) {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Critical Error: Required environment variable ${key} is missing.`);
  }
  const isPlaceholder = val.startsWith("your_") || val.startsWith("dummy_") || val === "replace_with_64_char_random_hex_string" || val === "replace_with_32_char_random_string";
  if (isPlaceholder) {
    throw new Error(`Critical Error: Environment variable ${key} contains a placeholder value ("${val}"). Please configure real credentials.`);
  }
}

console.log("Google Client Loaded ✓");
console.log("GitHub Client Loaded ✓");

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";
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
import deploymentRoutes from "./routes/deploymentRoutes.js";
import pipelineRoutes from "./routes/pipelineRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import usageRoutes from "./routes/usageRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import requestLogger from "./middleware/requestLogger.js";
import { rateLimiter, nosqlSanitize, securityHeaders } from "./middleware/securityMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";
import { startSyncScheduler } from "./services/syncScheduler.js";

connectDB();

const app = express();

app.use(requestLogger);
app.use(securityHeaders);
app.use(rateLimiter);
app.use(nosqlSanitize);

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

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
app.use("/api/deployments", deploymentRoutes);
app.use("/api/pipelines", pipelineRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api", memberRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/health", healthRoutes);

// centralized error handling middleware
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("QAPilot API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start background auto sync engine scheduler
  startSyncScheduler(5);
});
