const express = require("express");
const nfbSchema = require("../schema/nfbSchema");
const router = express.Router();
const abi = require("./abi.json");
const ethers = require("ethers");
const contractAddress = "0xbF094728f66dB965dA606b4085A90e6212990c5B";
// main net : https://bsc-dataseed.binance.org/
const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
// const web3_bsc = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
const contract = new ethers.Contract(contractAddress, abi, provider);

router.post("/:id", async (req, res) => {
  //verifies that the message HelloWorld is signed by rightful owner
  const signature = req.body.signature;
  const owner = await contract.ownerOf(req.params.id);
  const signatureOwner = await ethers.utils.verifyMessage(
    "HelloWorld",
    signature
  );
  if (signatureOwner != owner) {
    res.json({ error: true, message: "Signature verification failed" });
  } else {
    const nfb = await nfbSchema.findOne({ bondId: req.params.id });
    nfb.isAvailable = true;
    await nfb.save();
    console.log(nfb);
    res.json({ error: false, message: "NFB listed for sale" });
  }
});

module.exports = router;
