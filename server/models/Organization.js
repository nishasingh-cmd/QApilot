import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    logo: {
      type: String,
      default: ""
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

organizationSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model("Organization", organizationSchema);
