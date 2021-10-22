const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recodeSchema = new Schema(
  {
    note: { type: String, trim: true },
    inventoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    restaurantId: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    type: {
      type: Number,
      trim: true,
      default: 0,
    },
    qte: {
      type: Number,
      trim: true,
      default: 0,
    },
    amount: {
      type: Number,
      trim: true,
      default: 0,
    },
    createdBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Recode", recodeSchema);
