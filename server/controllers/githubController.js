import { getGitHubToken, getGitHubUserRepos } from "../services/githubService.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const token = await getGitHubToken(code);
    const repos = await getGitHubUserRepos(token);

    // decode user from existing session cookie
    const userToken = req.cookies.token;
    if (!userToken) {
      return res.status(401).json({ message: "Not authorized, login session missing" });
    }
    
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.githubId = token;
    await user.save();

    res.json({
      message: "GitHub connected successfully",
      repos
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { githubCallback };
