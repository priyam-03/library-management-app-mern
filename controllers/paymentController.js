const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const Razorpay = require("razorpay");
const User = require("../models/userModel");
exports.checkout = async (req, res) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });

  var options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  console.log(options);
  var order;
  try {
    order = await instance.orders.create(options);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({
    success: true,
    order,
  });
};

exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  console.log(req.body);
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId: req.user._id,
    });
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_APT_SECRET,
    });

    const result = await instance.orders.fetchPayments(razorpay_order_id);
    // console.log(result.items[0].amount);
    const user = await User.findById(req.user.id);
    user.fine -= result.items[0].amount / 100;
    await user.save();
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
