const express = require("express");
const router = express.Router();

// Load input validation
const checkSession = require("../../validation/checkSession");

// Load node.js cmd
var cmd = require('node-cmd');
const isEmpty = require("is-empty");

// Load Config
const Config = require("../../config");

//default getstatus function
//parameter : serviceName
const checkStatus =(serviceName) =>{
  try{
    const syncDir = cmd.runSync(`systemctl status ${serviceName}`);
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

// @route POST api/dashboard/services
// return type
// {
//   success: true,
//   services : Config.services//array,
//   status : 
// }
router.post("/services", (req, res) => {
  
  // token validation
  const { errors, isValid } = checkSession(req);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  res.json({
    success: true,
    services : Config.services,
    webSocketServer : Config.webSocketServer,
    maxWebSocketMsg : Config.maxWebSocketMsg,
    status: "ok",
  });
});

// @route POST api/dashboard/status
// return type
// {
//   success: true,
//   services : Config.services//array,
//   status: status//array
// }
router.post("/status", (req, res) => {
  
  // token validation
  const { errors, isValid } = checkSession(req);
  // get serviceName
  const {serviceName} = req.body;
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  var status = checkStatus(serviceName);
  res.json({
    success: true,
    serviceName : serviceName,
    status: status
  });
});

// @route POST api/dashboard/start
router.post("/start", (req, res) => {
  
  // token validation
  const { errors, isValid } = checkSession(req);

    // get serviceName
    const {serviceName} = req.body;

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try{
    cmd.run(
      `systemctl start ${serviceName}`,
      function(err, data, stderr){
          var status = checkStatus(serviceName);
          res.json({
            success: isEmpty(err) || isEmpty(stderr),
            serviceName : serviceName,
            status: status
          });
      }
  );
  }
  catch(err){
    return res.status(400).json(errors);
  }

});

// @route POST api/dashboard/stop
router.post("/stop", (req, res) => {
  
  // token validation
  const { errors, isValid } = checkSession(req);

  // get serviceName
  const {serviceName} = req.body;
  
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try{
    cmd.run(
      `systemctl stop ${serviceName}`,
      function(err, data, stderr){
          var status = checkStatus(serviceName);
          res.json({
            success: isEmpty(err) || isEmpty(stderr),
            serviceName : serviceName,
            status: status
          });
      }
  );
  }
  catch(err){
    return res.status(400).json(errors);
  }

});

// @route POST api/dashboard/restart
router.post("/restart", (req, res) => {
  // token validation
  const { errors, isValid } = checkSession(req);

  // get serviceName
  const {serviceName} = req.body;

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try{
    cmd.run(
      `systemctl restart ${serviceName}`,
      function(err, data, stderr){
          var status = checkStatus(serviceName);
          res.json({
            success: isEmpty(err) || isEmpty(stderr),
            serviceName : serviceName,
            status: status
          });
      }
  );
  }
  catch(err){
    return res.status(400).json(errors);
  }

});

module.exports = router;
