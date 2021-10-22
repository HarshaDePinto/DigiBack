const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const invoiceSchema = new Schema(
  {
    status: {
      type: Number,
      default: 0,
    },
    //0 - Placed
    //1 - Accepted
    //2 - Delivered
    //3 - Canceled
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    deliveryMethod: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: Number,
      default: 0,
    },
    //0 - Cash
    //1 - Card
    //2 - Online

    clientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    clientName: {
      type: String,
      trim: true,
      required: true,
    },

    clientMobile: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 10,
    },
    clientDeliveryAddress: {
      type: String,
      trim: true,
      default: null,
    },
    deliveryInstructions: {
      type: String,
      trim: true,
      default: null,
    },
    pickupRestaurant: {
      type: String,
      trim: true,
      default: null,
    },
    pickupInstructions: {
      type: String,
      trim: true,
      default: null,
    },
    promotionCode: {
      type: String,
      trim: true,
      default: null,
    },

    totalAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    discountPromotion: {
      type: Number,
      min: 0,
      default: 0,
    },
    finalAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    cashierId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    cashierName: {
      type: String,
      trim: true,
      default: null,
    },
    onlinePaymentStatus: {
      type: Number,
      default: 1,
    },
    //0 - pending
    //2 - success
    //-1 - canceled
    //-2 - failed
    //-3 - chargedBack
    merchantId: {
      type: String,
      trim: true,
      default: null,
    },
    orderId: {
      type: String,
      trim: true,
      default: null,
    },
    paymentId: {
      type: String,
      trim: true,
      default: null,
    },
    payhereAmount: {
      type: String,
      trim: true,
      default: null,
    },
    capturedAmount: {
      type: String,
      trim: true,
      default: null,
    },
    
    payhereCurrency: {
      type: String,
      trim: true,
      default: null,
    },
    md5sig: {
      type: String,
      trim: true,
      default: null,
    },
    payhereMethod: {
      type: String,
      trim: true,
      default: null,
    },
    cardHolderName: {
      type: String,
      trim: true,
      default: null,
    },
    cardNo: {
      type: String,
      trim: true,
      default: null,
    },
    cardExpiry: {
      type: String,
      trim: true,
      default: null,
    },
    products: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Invoice", invoiceSchema);
