import passport from "passport";
import { googleStrategy } from "./googleStrategy.js";
import { githubStrategy } from "./githubStrategy.js";
import User from "../models/User.js";

passport.use(googleStrategy);
passport.use(githubStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
