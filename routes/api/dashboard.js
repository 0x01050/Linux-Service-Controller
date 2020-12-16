const express = require("express");
const router = express.Router();

// Load input validation
const checkSession = require("../../validation/checkSession");

// Load node.js cmd
var cmd=require('node-cmd');
const isEmpty = require("is-empty");

// Load Config
const Config = require("../../config");

//default getstatus function
const checkStatus =() =>{
  try{
    const syncDir = cmd.runSync(`systemctl status ${Config.serviceName}`);
    var data = syncDir.data;
    if(data === null) return "Not Found";
    
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
  catch(err){
    return "Not Found";
  }
}

// @route POST api/dashboard/status
router.post("/status", (req, res) => {
  
  // token validation
  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  var status = checkStatus();
  res.json({
    success: true,
    serviceName : Config.friendlyName,
    status: status
  });
});

// @route POST api/dashboard/start
router.post("/start", (req, res) => {
  
  // token validation
  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  cmd.run(
    `systemctl start ${Config.serviceName}`,
    function(err, data, stderr){
        var status = checkStatus();
        res.json({
          success: isEmpty(err) || isEmpty(stderr),
          serviceName : Config.friendlyName,
          status: status
        });
    }
);

});

// @route POST api/dashboard/stop
router.post("/stop", (req, res) => {
  
  // token validation
  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  cmd.run(
    `systemctl stop ${Config.serviceName}`,
    function(err, data, stderr){
        var status = checkStatus();
        res.json({
          success: isEmpty(err) || isEmpty(stderr),
          serviceName : Config.friendlyName,
          status: status
        });
    }
);

});

// @route POST api/dashboard/restart
router.post("/restart", (req, res) => {
  // token validation

  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  cmd.run(
    `systemctl restart ${Config.serviceName}`,
    function(err, data, stderr){
        var status = checkStatus();
        res.json({
          success: isEmpty(err) || isEmpty(stderr),
          serviceName : Config.friendlyName,
          status: status
        });
    }
);
});

module.exports = router;
