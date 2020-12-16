const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const dashboard = require("./routes/api/dashboard");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());


// Passport middleware
app.use(passport.initialize());

// Routes
app.use("/api/users", users);
app.use("/api/dashboard", dashboard);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
