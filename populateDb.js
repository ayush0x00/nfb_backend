const nfbSchema = require("./schema/nfbSchema");
const mongoose = require("mongoose");
require("dotenv/config");

const LightCertUrl =
  "https://nfb-mages.s3.us-east-2.amazonaws.com/LightCert.png";
const LightCertSoldUrl =
  "https://nfb-mages.s3.us-east-2.amazonaws.com/LightCertSold.png";
const DarkCertSoldUrl =
  "https://nfb-mages.s3.us-east-2.amazonaws.com/DarkCertSold.png";
const DarkCertUrl = "https://nfb-mages.s3.us-east-2.amazonaws.com/DarkCert.png";
const nfbLimit = 100;

let priceInCd3Fi = [1000.0];
let roundedPrice = [1000.0];
let increment = 10001;

function generatePrice() {
  for (let i = 1; i <= nfbLimit; i++) {
    priceInCd3Fi[i] = (priceInCd3Fi[i - 1] * increment) / 10000;
    roundedPrice[i] = (
      Math.round((priceInCd3Fi[i] + Number.EPSILON) * 100) / 100
    ).toFixed(2);
    increment += 1;
  }
}

async function connect() {
  try {
    await mongoose.connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected!");
  } catch (e) {
    console.log(e);
  }
}

async function populateDb(i) {
  try {
    const nfb = new nfbSchema({
      image:
        i % 3 == 0
          ? i % 2 == 0
            ? LightCertUrl
            : DarkCertUrl
          : i % 2 == 0
          ? LightCertSoldUrl
          : DarkCertSoldUrl,
      owner: "admin",
      price: roundedPrice[i],
      isAvailable: i % 3 == 0 ? true : false,
      bondId: i,
      timestamp: Date.now(),
    });
    await nfb.save();
  } catch (e) {
    console.log(e);
  }
}

async function test() {
  try {
    await connect();
    generatePrice();
    // printPrice();
    for (let i = 0; i < nfbLimit; i++) {
      console.log("Awaiting save....", i);
      await populateDb(i);
    }
  } catch (e) {
    console.log(e);
  }
}

test();
