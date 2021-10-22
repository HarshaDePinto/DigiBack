const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customSchema = new Schema({
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
    default:0,
  },
  price_jumbo: {
    type: Number,
    trim: true,
    min: 0,
    default:0,
  },
  lettuceMax: {
    type: Number,
    trim: true,
    min: 0,
    default:0,
  },
  lettuceMin: {
    type: Number,
    trim: true,
    min: 0,
    default:0,
  },
  throwMax: {
    type: Number,
    trim: true,
    min: 0,
    default:0,
  },
  throwMin: {
    type: Number,
    trim: true,
    min: 0,
    default:0,
  },
  proteinMax: {
    type: Number,
    trim: true,
    min: 0,
    default:0,
  },
  proteinMin: {
    type: Number,
    trim: true,
    min: 0,
    default:0,
  },
  
  photo: {
    data: Buffer,
    contentType: String,
  },

  sold: {
    type: Number,
    min: 0,
    default:0,
  },


  createdBy: {
    type: String,
    default: null,
  },
  updatedBy: {
    type: String,
    default: null,
  },

},{ timestamps: true });

module.exports = new mongoose.model("Custom", customSchema);
