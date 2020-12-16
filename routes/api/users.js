const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
    // Check if user exists
  if (!User || User.email !== email) {
    return res.status(404).json({ emailnotfound: "Email not found" });
  }

  // Check password
  if (password === User.password) {
    // User matched
    // Create JWT Payload
    const payload = {
      id: User.id,
      name: User.name
    };

    // Sign token
    jwt.sign(
      payload,
      keys.secretOrKey,
      {
        expiresIn: 31556926 // 1 year in seconds
      },
      (err, token) => {
        // console.log(token);
        res.json({
          success: true,
          token: "Bearer " + token
        });
      }
    );
  } else {
    return res
      .status(400)
      .json({ passwordincorrect: "Password incorrect" });
  }
});

module.exports = router;
