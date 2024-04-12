const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // To check if the email already exists
          const user = await User.findOne({ where: { email: email } });

          // --- No user Found with the Input Email Id--- //
          if (!user) {
            return done(null, false, { message: "No user with this email" });
          }

          // --- Input User's Email Found and Password Matched --- //
          const match = await bcrypt.compare(password, user.password);

          if (match) {
            return done(null, user, { message: "Logged in Successfully" });
          } else {
            // --- Input User's Email Found but Password did not Matched --- //
            return done(null, false, { message: "Wrong username or password" });
          }
        } catch (error) {
          // --- Error handling --- //
          return done(null, false, { message: "Something went wrong" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    // user.id store after login
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    // To get the user from the id
    try {
      const user = await User.findOne({ where: { id: id } });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}

module.exports = init;
