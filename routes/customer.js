const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Donation = require("../models/donation.js");

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


router.get(
  "/customer/MyOrders",
  middleware.ensureCustomerLoggedIn,
  async (req, res) => {
    try {
      const cusorderfoods = await Donation.find({
        status: ["accepted", "assigned"],
      }).populate("donor");
      res.render("customer/MyOrders", {
        title: "MyOrders",
        cusorderfoods,
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);











router.get(
  "/admin/donation/view/:donationId",
  middleware.ensureAdminLoggedIn,
  async (req, res) => {
    try {
      const donationId = req.params.donationId;
      const donation = await Donation.findById(donationId)
        .populate("donor")
        .populate("agent");
      res.render("admin/donation", { title: "Donation details", donation });
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

router.get(
  "/admin/donation/accept/:donationId",
  middleware.ensureAdminLoggedIn,
  async (req, res) => {
    try {
      const donationId = req.params.donationId;
      await Donation.findByIdAndUpdate(donationId, { status: "accepted" });
      req.flash("success", "Donation accepted successfully");
      res.redirect(`/admin/donation/view/${donationId}`);
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

router.get(
  "/admin/donation/reject/:donationId",
  middleware.ensureAdminLoggedIn,
  async (req, res) => {
    try {
      const donationId = req.params.donationId;
      await Donation.findByIdAndUpdate(donationId, { status: "rejected" });
      req.flash("success", "Donation rejected successfully");
      res.redirect(`/admin/donation/view/${donationId}`);
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

router.get(
  "/admin/donation/assign/:donationId",
  middleware.ensureAdminLoggedIn,
  async (req, res) => {
    try {
      const donationId = req.params.donationId;
      const agents = await User.find({ role: "agent" });
      const donation = await Donation.findById(donationId).populate("donor");
      res.render("admin/assignAgent", {
        title: "Assign agent",
        donation,
        agents,
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

router.post(
  "/admin/donation/assign/:donationId",
  middleware.ensureAdminLoggedIn,
  async (req, res) => {
    try {
      const donationId = req.params.donationId;
      const { agent, adminToAgentMsg } = req.body;
      await Donation.findByIdAndUpdate(donationId, {
        status: "assigned",
        agent,
        adminToAgentMsg,
      });
      req.flash("success", "Agent assigned successfully");
      res.redirect(`/admin/donation/view/${donationId}`);
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

router.get(
  "/admin/agents",
  middleware.ensureAdminLoggedIn,
  async (req, res) => {
    try {
      const agents = await User.find({ role: "agent" });
      res.render("admin/agents", { title: "List of agents", agents });
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

router.get("/admin/profile", middleware.ensureAdminLoggedIn, (req, res) => {
  res.render("admin/profile", { title: "My profile" });
});

router.put(
  "/admin/profile",
  middleware.ensureAdminLoggedIn,
  async (req, res) => {
    try {
      const id = req.user._id;
      const updateObj = req.body.admin; // updateObj: {firstName, lastName, gender, address, phone}
      await User.findByIdAndUpdate(id, updateObj);

      req.flash("success", "Profile updated successfully");
      res.redirect("/admin/profile");
    } catch (err) {
      console.log(err);
      req.flash("error", "Some error occurred on the server.");
      res.redirect("back");
    }
  }
);

module.exports = router;
