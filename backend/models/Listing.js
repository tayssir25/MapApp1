const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    adress: {
      type: String,
      require: true,
    },
    latitude: {
      type: String,
      require: true,
    },
    longitude: {
      type: String,
      require: true,
    },
    description: String,
    img: {
      data: Buffer,
      contentType: String,
    },
    sector: { type: String, enum: ["public", "private"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
