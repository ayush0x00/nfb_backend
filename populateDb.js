const nfbSchema = require("./schema/nfbSchema");
const mongoose = require("mongoose");
require("dotenv/config");

const LightCertUrl = "light";
const DarkCertUrl = "Dark";
const nfbLimit = 100;

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
      image: i % 2 == 0 ? LightCertUrl : DarkCertUrl,
      owner: "admin",
      price: "2222",
      isAvailable: i % 2 == 0 ? true : false,
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
    for (let i = 1; i <= nfbLimit; i++) {
      console.log("Awaiting save....", i);
      await populateDb(i);
    }
  } catch (e) {
    console.log(e);
  }
}

test();
