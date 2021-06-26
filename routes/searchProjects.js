const express = require("express");
const router = express.Router();
const opDB = require("../db/OpTaskDB");

router.get("/:userid/:query/page/:page", async (req, res) => {
  const queryResults = await opDB.searchAndGetProjects(
    req.params.query,
    req.params.userid,
    req.params.page
  );
  res.send(queryResults);
});

router.get("/:userid/count/:query", async (req, res) => {
  const countResults = await opDB.getSearchResultCount(
    req.params.query,
    req.params.userid
  );
  res.send({ count: countResults });
});
module.exports = router;
