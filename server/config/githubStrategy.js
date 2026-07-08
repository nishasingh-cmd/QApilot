import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";
import { encrypt } from "../utils/encryption.js";

export const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID || "dummy_github_client_id",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy_github_client_secret",
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || (profile._json && profile._json.email);
      // Fallback email if GitHub account does not expose a public email address
      const userEmail = email ? email.toLowerCase() : `${profile.username.toLowerCase()}@github.com`;

      const avatarUrl = profile.photos?.[0]?.value || profile._json?.avatar_url || null;
      const encryptedToken = accessToken ? encrypt(accessToken) : null;

      // Find user by githubId or email
      let user = await User.findOne({
        $or: [{ githubId: profile.id }, { email: userEmail }],
      });

      if (user) {
        // Merge OAuth data if they match
        let isModified = false;
        if (!user.githubId) {
          user.githubId = profile.id;
          isModified = true;
        }
        if (!user.githubUsername) {
          user.githubUsername = profile.username;
          isModified = true;
        }
        if (!user.avatar && avatarUrl) {
          user.avatar = avatarUrl;
          isModified = true;
        }
        if (!user.profileImage && avatarUrl) {
          user.profileImage = avatarUrl;
          isModified = true;
        }
        if (encryptedToken) {
          user.githubAccessToken = encryptedToken;
          isModified = true;
        }
        if (!user.providerId) {
          user.providerId = profile.id;
          isModified = true;
        }
        if (user.provider === "local") {
          user.provider = "github";
          isModified = true;
        }
        user.lastLogin = new Date();
        isModified = true;

        if (isModified) {
          await user.save();
        }
        return done(null, user);
      } else {
        // Create new GitHub user
        user = new User({
          name: profile.displayName || profile.username || "GitHub User",
          email: userEmail,
          githubId: profile.id,
          githubUsername: profile.username,
          avatar: avatarUrl,
          profileImage: avatarUrl,
          provider: "github",
          providerId: profile.id,
          githubAccessToken: encryptedToken,
          lastLogin: new Date(),
        });
        await user.save();
        return done(null, user);
      }
    } catch (error) {
      return done(error, null);
    }
  }
);

export default githubStrategy;
