const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Load input validation
const validateLoginInput = require("../../validation/login");

// Load Config
const Config = require("../../config");

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

  // check user by email
    // Check if user exists
  if (!Config || Config.email !== email) {
    return res.status(404).json({ emailnotfound: "Email not found" });
  }

  // Check password
  if (password === Config.password) {
    // User matched
    // Create JWT Payload
    const payload = {
      email: Config.email,
    };

    // Sign token
    jwt.sign(
      payload,
      Config.secretOrKey,
      {
        expiresIn: 31556926 // 1 year in seconds
      },
      (err, token) => {
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
