const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const restaurantSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    createdBy: {
      type: String,
      default: null,
    },
    updatedBy: {
      type: String,
      default: null,
    },
    salads: [{ type: mongoose.Types.ObjectId, ref: "Salad" }],
    soups: [{ type: mongoose.Types.ObjectId, ref: "Soup" }],
    foods: [{ type: mongoose.Types.ObjectId, ref: "Food" }],
    addons: [{ type: mongoose.Types.ObjectId, ref: "Addon" }],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Restaurant", restaurantSchema);
