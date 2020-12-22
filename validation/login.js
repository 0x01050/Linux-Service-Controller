const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.user = !isEmpty(data.user) ? data.user : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // User checks
  if (Validator.isEmpty(data.user)) {
    errors.user = "User field is required";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
