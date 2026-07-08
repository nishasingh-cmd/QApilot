import express from "express";
import passport from "../config/passport.js";
import { registerUser, loginUser, getMe, logoutUser, generateToken, setTokenCookie } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error?error=Google authentication failed` }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error?error=Google user not found`);
      }
      const token = generateToken(req.user._id);
      setTokenCookie(res, token);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/success`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }
);

// GitHub OAuth routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error?error=GitHub authentication failed` }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error?error=GitHub user not found`);
      }
      const token = generateToken(req.user._id);
      setTokenCookie(res, token);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/success`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }
);

export default router;
