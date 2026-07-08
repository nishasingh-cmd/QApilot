import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "dummy_google_client_id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_google_client_secret",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("No email associated with Google account"), null);
      }

      const lowerEmail = email.toLowerCase();
      const avatarUrl = profile.photos?.[0]?.value || null;

      // Find user by googleId or email
      let user = await User.findOne({
        $or: [{ googleId: profile.id }, { email: lowerEmail }],
      });

      if (user) {
        // Merge OAuth data if they match
        let isModified = false;
        if (!user.googleId) {
          user.googleId = profile.id;
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
        if (!user.providerId) {
          user.providerId = profile.id;
          isModified = true;
        }
        if (user.provider === "local") {
          user.provider = "google";
          isModified = true;
        }
        user.lastLogin = new Date();
        isModified = true;

        if (isModified) {
          await user.save();
        }
        return done(null, user);
      } else {
        // Create new Google user
        user = new User({
          name: profile.displayName || profile.name?.givenName || "Google User",
          email: lowerEmail,
          googleId: profile.id,
          avatar: avatarUrl,
          profileImage: avatarUrl,
          provider: "google",
          providerId: profile.id,
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

export default googleStrategy;
