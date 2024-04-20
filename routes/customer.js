const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Donation = require("../models/donation.js");
const Order = require("../models/order.js");

router.get(
  "/customer/dashboard",
  middleware.ensureCustomerLoggedIn,
  async (req, res) => {
    const numHotels = await User.countDocuments({ role: "donor" });
    const numFoodsavailable = await Donation.countDocuments({ quantity: "" });
    const numDonors = await User.countDocuments({ role: "donor" });
    const numUsers = await User.countDocuments({ role: "customer" });
    const numfoodslist = await Donation.countDocuments({
      foodtype: "",
    });

    res.render("customer/dashboard", {
      title: "Dashboard",
      numHotels,
      numFoodsavailable,
      numDonors,
      numUsers,
      numfoodslist,
    });
  }
);

router.get(
  "/customer/foodslist",
  middleware.ensureCustomerLoggedIn,
  async (req, res) => {
    try {
      const allfoods = await Donation.find({
        status: ["accepted", "assigned"],
      }).populate("donor");
      res.render("customer/foodslist", {
        title: "All Foods",
        allfoods,
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

router.get(
  "/customer/AddToCart",
  middleware.ensureCustomerLoggedIn,
  async (req, res) => {
    try {
      const addfoods = await Donation.find({
        status: ["accepted", "assigned"],
      }).populate("donor");
      res.render("customer/AddToCart", {
        title: "AddToCart",
        addfoods,
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

// router.post(
//   "/customer/AddToCart",
//   middleware.ensureCustomerLoggedIn,
//   async (req, res) => {
//     try {
//       const orders = req.body.order;
//       orders.customer = req.user._id;

//       // Create a new order document using Mongoose:
//       const order = new Order(orders);
//       await order.save();
//       req.flash("success", "order sent successfully");
//       res.redirect("/customer/MyOrders");

//       res.json({ message: "Order added successfully" });
//     } catch (error) {
//       console.error("Error adding order:", error);
//       res.status(500).json({ message: "Error adding order" });
//     }
//   }
// );
router.put(
  "/customer/AddToCart",
  middleware.ensureCustomerLoggedIn,
  async (req, res) => {
    try {
      // Extract the required data from the request body:
      const { foodType, quantity, price } = req.body.order;

      // Calculate the amount:
      const amount = quantity * price;

      // Prepare the order object with all necessary fields:
      const order = {
        customer: req.user._id,
        foodType,
        quantity,
        price,
        amount,
      };

      // Create a new order document using Mongoose:
      const orders = new Order(order);
      await orders.save();

      // Send a success message and redirect to the My Orders page:
      req.flash("success", "Order sent successfully");
      res.redirect("/customer/MyOrders");

      // Optionally, also send a JSON response for API calls:
      res.json({ message: "Order added successfully" });
    } catch (error) {
      console.error("Error adding order:", error);
      res.status(500).json({ message: "Error adding order" });
    }
  }
);

router.get(
  "/customer/MyOrders",
  middleware.ensureCustomerLoggedIn,
  async (req, res) => {
    try {
      const orderData = await Order.find().populate("customer");
      res.render("customer/MyOrders", {
        title: "MyOrders",
        orderData,
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

//post

router.get("/customer/profile", middleware.ensureCustomerLoggedIn, (req, res) => {
  res.render("customer/profile", { title: "My profile" });
});

router.put(
  "/customer/profile",
  middleware.ensureCustomerLoggedIn,
  async (req, res) => {
    try {
      const id = req.user._id;
      const updateObj = req.body.customer; // updateObj: {firstName, lastName, gender, address, phone}
      await User.findByIdAndUpdate(id, updateObj);

      req.flash("success", "Profile updated successfully");
      res.redirect("/customer/profile");
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);


module.exports = router;
