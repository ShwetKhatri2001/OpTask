const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const opDB = require("../db/OpTaskDB");
const passwordUtils = require("./passwordUtils");

const customFields = {
  usernameField: "userEmail",
  passwordField: "userPassword",
};

const verifyCallback = async (username, password, done) => {
  const user = await opDB.getUserByEmail(username);
  if (!user) {
    return done(null, false);
  }
  const isValid = passwordUtils.validatePassword(
    password,
    user.hash,
    user.salt
  );

  if (isValid) {
    return done(null, user);
  } else {
    return done(null, false);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await opDB.getUserById(userId);
  if (user) {
    done(null, user);
  }
});
