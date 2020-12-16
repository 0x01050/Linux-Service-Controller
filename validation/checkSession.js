const Validator = require("validator");
const isEmpty = require("is-empty");
const jwt = require("jsonwebtoken");
const Config = require("../config");

module.exports = function checkSession(req) {
  let errors = {};
  try{
  // get auth header
  const authHeader = req.headers.authorization;

  // Token checks
  if (Validator.isEmpty(authHeader)) {
    errors.token = "Token is required";
  } 
  else {
    // verify token
    const token = authHeader.split(' ')[1];
    jwt.verify(
      token,
      Config.secretOrKey,
      (err, decoded) => {
        if(err)
        {
          errors.token = "Token is invalid";
        }

      }
    )
  }
  }
  catch(e){
    errors.token = "Token is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
