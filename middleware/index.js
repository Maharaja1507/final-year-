const middleware = {
  ensureLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("warning", "Please log in first to continue");
    res.redirect("/auth/login");
  },

  ensureAdminLoggedIn: (req, res, next) => {
    if (req.isUnauthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Please log in first to continue");
      return res.redirect("/auth/login");
    }
    if (req.user.role != "admin") {
      req.flash("warning", "This route is allowed for admin only!!");
      return res.redirect("back");
    }
    next();
  },

  ensureDonorLoggedIn: (req, res, next) => {
    if (req.isUnauthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Please log in first to continue");
      return res.redirect("/auth/login");
    }
    if (req.user.role != "donor") {
      req.flash("warning", "This route is allowed for donor only!!");
      return res.redirect("back");
    }
    next();
  },

  ensureAgentLoggedIn: (req, res, next) => {
    if (req.isUnauthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Please log in first to continue");
      return res.redirect("/auth/login");
    }
    if (req.user.role != "agent") {
      req.flash("warning", "This route is allowed for agent only!!");
      return res.redirect("back");
    }
    next();
  },

  //own change

  ensureCustomerLoggedIn: (req, res, next) => {
    if (req.isUnauthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Please log in first to continue");
      return res.redirect("/auth/login");
    }
    if (req.user.role != "customer") {
      req.flash("warning", "This route is allowed for customer only!!");
      return res.redirect("back");
    }
    next();
  },

  ensureNotLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash("warning", "Please logout first to continue");
      if (req.user.role == "admin") return res.redirect("/admin/dashboard");
      if (req.user.role == "donor") return res.redirect("/donor/dashboard");
      if (req.user.role == "agent") return res.redirect("/agent/dashboard");
      // own change
      if (req.user.role == "customer")return res.redirect("/customer/dashboard");
    }
    next();
  },
};

module.exports = middleware;
