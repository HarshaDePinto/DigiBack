const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 40,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
    },

    photo1: {
      data: Buffer,
      contentType: String,
    },
    photo2: {
      data: Buffer,
      contentType: String,
    },

    createdBy: {
      type: String,
      default:null,

    },
    updatedBy: {
      type: String,
      default:null,

    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodCategory", foodCategorySchema);
