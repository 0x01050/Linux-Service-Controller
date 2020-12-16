const Config = require("../config");

const User = {
  id: "007007",
  name: "Ioannis",
  email: Config.email,
  password: Config.password,
  friendlyName : Config.friendlyName,
  serviceName : Config.serviceName,
};

module.exports = User;
