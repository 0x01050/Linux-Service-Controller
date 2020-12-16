const Validator = require("validator");
const isEmpty = require("is-empty");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = function checkSession(req) {
  let errors = {};

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
      keys.secretOrKey,
      (err, decoded) => {
        // console.log(err);
        // console.log(decoded);
        if(err)
        {
          errors.token = "Token is invalid";
        }

      }
    )
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
