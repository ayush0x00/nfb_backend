const express = require("express");
const nfbSchema = require("../schema/nfbSchema");
const router = express.Router();
const abi = require("./abi.json");
var Web3 = require("web3");
const contractAddress = "0x3C62DDC9415D81327bF76eFD251c6F3E0B4F38A7";
const adminAddress = "admin";
// main net : https://bsc-dataseed.binance.org/
const web3_bsc = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
const contract = new web3_bsc.eth.Contract(abi, contractAddress);

router.post("/:id", async (req, res) => {
  try {
    const owner = await contract.methods.ownerOf(req.params.id).call();
    if (owner != adminAddress) {
      const nfb = await nfbSchema.findOne({ bondId: req.params.id });
      nfb.isAvailable = false;
      await nfb.save();
      res.json({ error: false, message: "nfb sold" });
    } else {
      res.json({ error: true, message: "owner has not sold nfb" });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: true, message: "Error while selling" });
  }
});

module.exports = router;
