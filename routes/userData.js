const express = require("express");
const router = express.Router();
const opDB = require("../db/OpTaskDB");

router.get("/:id", async function (req, res) {
  const result = await opDB.getUserById(req.params.id);
  res.send(result);
});

router.post("/updateProfile", async function (req, res) {
  console.log(req.body.id);
  const databaseResult = await opDB.updateUserData(req.body.id, req.body);
  if (databaseResult) {
    res.send({ result: true });
  }
});

module.exports = router;
