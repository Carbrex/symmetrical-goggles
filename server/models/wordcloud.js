const mongoose = require("mongoose");

const WordCloudSchema = new mongoose.Schema(
  {
    name: { type: String },
    words: { type: Map, of: Number },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Room", WordCloudSchema);
