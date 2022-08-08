const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const availableNFB = require("./routes/availableNFB");
const soldNFB = require("./routes/soldNFB");
const sellNFB = require("./routes/sellNFB");
const resellNFB = require("./routes/resellNFB");
const cors = require("cors");

require("dotenv/config");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB connected");
  } catch (e) {
    console.log(e);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/soldNFB", soldNFB);
app.use("/availableNFB", availableNFB);
app.use("/sell", sellNFB);
app.use("/resell", resellNFB);

app.use("/sold", (req, res) => {
  res.send("Sold");
});

app.listen(1234);
