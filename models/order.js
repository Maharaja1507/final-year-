const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  foodType: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true, //own change
  },
  amount: {
    type: String,
    required: true, //own change
  },
});

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
