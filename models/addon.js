const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addonSchema = new Schema({
  title: { type: String, required: true },
  price: {
    type: Number,
    trim: true,
    min: 0,
    default: 0,
  },
  cal: {
    type: Number,
    trim: true,
    min: 0,
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  //0 - salad premium
  //1 - salad general
  //2 - soup
  //3 - food
  createdBy: {
    type: String,
    default: null,
  },
  updatedBy: {
    type: String,
    default: null,
  },
  restaurants: [{ type: mongoose.Types.ObjectId, ref: "Restaurant" }],
},{ timestamps: true });

module.exports = new mongoose.model("Addon", addonSchema);
