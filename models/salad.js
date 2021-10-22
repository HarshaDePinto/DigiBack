const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const saladSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 40,
    },
    subtitle: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    price_junior: {
      type: Number,
      trim: true,
      min: 0,
      default: 0,
    },
    price_jumbo: {
      type: Number,
      trim: true,
      min: 0,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },

    saladCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SaladCategory",
      required: true,
    },
    sold: {
      type: Number,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      default: 2.5,
    },
    totalRating: {
      type: Number,
      min: 0,
      default: 50,
    },
    ratingNumber: {
      type: Number,
      min: 0,
      default: 20,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    calorie: {
      type: Number,
      min: 0,
      default: 0,
    },
    meat: {
      type: Boolean,
      default: false,
    },
    vegetable: {
      type: Boolean,
      default: false,
    },
    cheese: {
      type: Boolean,
      default: false,
    },
    nut: {
      type: Boolean,
      default: false,
    },
    egg: {
      type: Boolean,
      default: false,
    },
    spicy: {
      type: Boolean,
      default: false,
    },
    chef: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      default: null,
    },
    updatedBy: {
      type: String,
      default: null,
    },

    restaurants: [{ type: mongoose.Types.ObjectId, ref: "Restaurant" }],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Salad", saladSchema);
