const express = require("express");
const nfbSchema = require("../schema/nfbSchema");
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await nfbSchema.find({ isAvailable: false });
  res.send(data);
});

module.exports = router;
