const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const dashboard = require("./routes/api/dashboard");

const app = express();

const webSocketsServerPort = 8000;
const http = require('http');
const webSocketServer = require('websocket').server;

// http and websocket server configuration
const server = http.createServer();
server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + ` Server is listening on port ${webSocketsServerPort}`);
});

const wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

// websocket server set-up
wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  
  function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }

  var connection = request.accept(null, request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function(message) {
      if (message.type === 'utf8') {
          console.log('Received Message: ' + message.utf8Data);
          connection.sendUTF(JSON.stringify(message.utf8Data));

          //for each websocket client broadcast
          wsServer
          .connections
          .forEach( client => {
              //send the client the current message
              client.sendUTF(`{ "message" : "${message.utf8Data}" }`);
          });
      }
      else if (message.type === 'binary') {
          console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
          connection.sendBytes(message.binaryData);
      }
  });
  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

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
app.use("/users", users);
app.use("/dashboard", dashboard);
// Routes for debug
app.use("/api/users", users);
app.use("/api/dashboard", dashboard);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
