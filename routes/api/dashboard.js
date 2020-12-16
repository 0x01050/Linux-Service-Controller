const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const checkSession = require("../../validation/checkSession");

// Load User model
const User = require("../../models/User");

// Load node.js cmd
var cmd=require('node-cmd');
const isEmpty = require("is-empty");

//default getstatus function
const checkStatus =() =>{
  const syncDir = cmd.runSync(`systemctl status ${User.serviceName}`);
  var data = syncDir.data;
  if(data === null) return "Not Found";
  // console.log('examples dir now contains the example file along with : '+data);
  //command output parsing
  var n = data.indexOf("Active: ");
  var sub = data.substring(n);
  var status = "";
  if(n < 0)
  {
    status = "Not Found";
  }
  else
  {
    var array = sub.split(' ');
    if(array[1] === "active")
      status = "on";
    else
    {
      status = "off";
    }
  }
return status;
}

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/status", (req, res) => {
  // Form validation

  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
    cmd.run(
      `systemctl status ${User.serviceName}`,
      function(err, data, stderr){
          // console.log('examples dir now contains the example file along with : '+data);
          //command output parsing
          var n = data.indexOf("Active: ");
          var sub = data.substring(n);
          var status = "";
          if(n < 0)
          {
            status = "Not Found";
          }
          else
          {
            var array = sub.split(' ');
            if(array[1] === "active")
              status = "on";
            else
            {
              status = "off";
            }
          }

          res.json({
            success: true,
            serviceName : User.friendlyName,
            status: status
          });
      }
  );

});

router.post("/start", (req, res) => {
  // Form validation

  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  cmd.run(
    `systemctl start ${User.serviceName}`,
    function(err, data, stderr){
        var status = checkStatus();
        res.json({
          success: isEmpty(err) || isEmpty(stderr),
          serviceName : User.friendlyName,
          status: status
        });
    }
);

});

router.post("/stop", (req, res) => {
  // Form validation

  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  cmd.run(
    `systemctl stop ${User.serviceName}`,
    function(err, data, stderr){
        var status = checkStatus();
        res.json({
          success: isEmpty(err) || isEmpty(stderr),
          serviceName : User.friendlyName,
          status: status
        });
    }
);

});

router.post("/restart", (req, res) => {
  // Form validation

  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  cmd.run(
    `systemctl restart ${User.serviceName}`,
    function(err, data, stderr){
        var status = checkStatus();
        res.json({
          success: isEmpty(err) || isEmpty(stderr),
          serviceName : User.friendlyName,
          status: status
        });
    }
);

});

module.exports = router;
