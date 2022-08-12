const express = require("express");
const nfbSchema = require("../schema/nfbSchema");
const router = express.Router();
const abi = require("./abi.json");
const ethers = require("ethers");
const contractAddress = "0x714131c8967663428E4e3bfFC39DC96C743943D2";
// main net : https://bsc-dataseed.binance.org/
const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);
// const web3_bsc = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
const contract = new ethers.Contract(contractAddress, abi, provider);
const adminAddress = "0x746471b7548166FAD193809D0588D7b4213eA906";
// main net : https://bsc-dataseed.binance.org/
const LightCertUrl =
  "https://nfb-mages.s3.us-east-2.amazonaws.com/LightCert.png";
const LightCertSoldUrl =
  "https://nfb-mages.s3.us-east-2.amazonaws.com/LightCertSold.png";
const DarkCertSoldUrl =
  "https://nfb-mages.s3.us-east-2.amazonaws.com/DarkCertSold.png";

router.get("/:id", async (req, res) => {
  try {
    const owner = await contract.ownerOf(req.params.id);
    console.log(owner);
    if (owner != adminAddress) {
      const nfb = await nfbSchema.findOne({ bondId: req.params.id });
      nfb.isAvailable = false;
      if (nfb.image == LightCertUrl) nfb.image = LightCertSoldUrl;
      else nfb.image = DarkCertSoldUrl;
      nfb.owner = owner;
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
