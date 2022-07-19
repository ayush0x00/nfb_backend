const mongoose = require("mongoose");

const nfbSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  bondId: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("nfbSchema", nfbSchema);
