const mongoose = require("mongoose");
const { Schema } = mongoose;
const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  userId: { type: Schema.Types.ObjectId, ref: "Userauth" },
});

module.exports = mongoose.model("Payment", paymentSchema);
