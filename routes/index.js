var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.send(`you have visisted ${req.session.viewCount}`);
});

router.get("/data", function (req, res) {
  res.send({ name: "We're connected...", email: "to the backend!!!" });
});

module.exports = router;
