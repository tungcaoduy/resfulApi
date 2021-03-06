const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, require: true },
  type: {
    type: String,
    enum: ["electronic", "fashion", "food"],
    require: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
