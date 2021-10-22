const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const promotionSchema = new Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    createdBy: {
      type: String,
      default: null,
    },
    updatedBy: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Promotion", promotionSchema);
