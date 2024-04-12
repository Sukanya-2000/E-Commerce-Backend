const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
  return {
    // Get Register Controller
    register: async function (req, res) {
      res.render("auth/register");
    },

    // Post Register Controller
    postRegister: async function (req, res) {
      const { name, email, password } = req.body;
      // Validating User Data
      if (!name || !email || !password) {
        req.flash("error", "All fields are required");
        return res.redirect("/register");
      }

      try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          req.flash("error", "Email already exists");
          return res.redirect("/register");
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a New User in the DB
        const newUser = new User({
          name: name,
          email: email,
          password: hashedPassword,
        });

        // Save user to the database
        await newUser.save();
        req.flash("success", "Registration successful. Please log in.");
        res.redirect("/login");
      } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/register");
      }
    },

    // Get Login Controller
    login: function (req, res) {
      res.render("auth/login");
    },

    // Post Login Controller
postLogin: function (req, res, next) {
  const { email, password } = req.body;
  // Validating User Data
  if (!email || !password) {
    req.flash("error", "All fields are required");
    return res.redirect("/login");
  }

  // Passport local authentication
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Redirect admin users to the admin dashboard
      if (user.role === "admin") {
        return res.redirect("/admin/orders");
      }
      // Redirect regular users to the home page
      return res.redirect("/");
    });
  })(req, res, next);
},


   // Logout Controller
logout: function (req, res) {
    req.logout(function(err) {
      if (err) {
        req.flash("error", "Failed to log out");
        return res.redirect("/"); // Redirect to home page or login page
      }
      req.flash("success", "Logged out successfully");
      res.redirect("/login"); // Redirect to login page
    });
  },
  
  };
}

module.exports = authController;
