const express = require("express");
const router = express.Router();
const passwordUtils = require("../auth/passwordUtils");
const passport = require("passport");
const opDB = require("../db/OpTaskDB");

// handles login requests
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({ loginStatus: false });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send({ loginState: user.username });
    });
  })(req, res, next);
});

//handles register requests
router.post("/register", async (req, res) => {
  const duplicateEmail = await opDB.getUserByEmail(req.body.userEmail);
  if (!duplicateEmail) {
    const saltHash = passwordUtils.generatePassword(req.body.userPassword);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    opDB.saveNewUser({
      fullname: req.body.userFullName,
      institution: req.body.userInst,
      job: req.body.userJob,
      location: req.body.userLocation,
      username: req.body.userEmail,
      hash: hash,
      salt: salt,
    });
    res.send({ registered: true });
  } else {
    res.send({ registered: false });
  }
});

router.get("/isLoggedIn", (req, res) => {
  const isLoggedIn = req.isAuthenticated();
  res.send({ isLoggedIn: isLoggedIn, user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.send({ logout: true });
});

module.exports = router;
