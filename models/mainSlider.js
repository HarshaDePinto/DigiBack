const mongoose = require("mongoose");


const mainSliderSchema = new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength:60,
    },
    subtitle: {
        type: String,
        trim: true,
        required: true,
        maxlength:60,
      },

      active: {
        type: Boolean,
        default:false,
      },

      photo: {
        data: Buffer,
        contentType: String,
      },

      position: {
        type: String,
        default:"justify-content-start",

      },
      colPosition: {
        type: String,
        default:"",

      },
      createdBy: {
        type: String,
        default:null,

      },
      updatedBy: {
        type: String,
        default:null,

      },
 
  },{timestamps:true});


module.exports = mongoose.model("MainSlider",mainSliderSchema);