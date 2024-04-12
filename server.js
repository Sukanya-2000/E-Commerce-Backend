const express = require("express");
const app = express();
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");
const sequelize = require("./app/utils/database");
require('dotenv').config();


// Session Store
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Session Configuration
app.use(
  session({
    secret: 'sukanya333',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
  })
);

// Passport Configuration
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// To serve static files
app.use(express.static(path.join(__dirname, 'public'), {
  // Specify MIME types for specific file extensions
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// To parse form data
app.use(express.urlencoded({ extended: false }));

// Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// Template Engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Routes
require("./routes/web")(app);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
