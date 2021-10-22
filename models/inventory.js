const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const inventorySchema = new Schema(
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
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Inventory", inventorySchema);
