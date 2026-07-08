import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: false,
      default: null
    },
    avatar: {
      type: String,
      default: null
    },
    provider: {
      type: String,
      required: true,
      default: "local"
    },
    providerId: {
      type: String,
      default: null
    },
    githubId: {
      type: String,
      default: null
    },
    githubUsername: {
      type: String,
      default: null
    },
    googleId: {
      type: String,
      default: null
    },
    githubAccessToken: {
      type: String,
      default: null
    },
    refreshToken: {
      type: String,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    },
    profileImage: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
