const express = require("express");
const nfbSchema = require("../schema/nfbSchema");
const router = express.Router();
const abi = require("./abi.json");
var Web3 = require("web3");
const contractAddress = "0xE71347Bb70d548B4a0C92cE753dC7DBF132318dC";
// main net : https://bsc-dataseed.binance.org/
const web3_bsc = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
const contract = new web3_bsc.eth.Contract(abi, contractAddress);

router.post("/:id", async (req, res) => {
  //verifies that the message HelloWorld is signed by rightful owner
  const signature = req.body.signature;
  const owner = await contract.methods.ownerOf(req.params.id).call();
  const signatureOwner = web3.eth.accounts.recover("HelloWorld", signature);
  if (signatureOwner != owner) {
    res.json({ error: true, message: "Signature verification failed" });
  } else {
    const nfb = await nfbSchema.findOne({ bondId: req.params.id });
    nfb.isAvailable = true;
  }
});

module.exports = router;
