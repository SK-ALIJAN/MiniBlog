const http = require("http");
const express = require("express");
const https = require("https");
const fs = require("fs");
const { Server } = require("socket.io");
const config = require("./index");

const app = express();

let server;

// Check if production environment and configure accordingly
if (config.env === "production") {
  var privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/d2c.tezcommerce.com/privkey.pem",
    "utf8"
  );
  var certificate = fs.readFileSync(
    "/etc/letsencrypt/live/d2c.tezcommerce.com/fullchain.pem",
    "utf8"
  );
  var credentials = { key: privateKey, cert: certificate };

  // Create an HTTPS server using the credentials
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

const io = new Server(server, {
  path: "/socket",
  cors: {
    origin: [
      "http://localhost:3001",
      "http://localhost:3003",
      "http://localhost:3000",
      "https://d2c.tezcommerce.com",
      "https://d2cstories.com",
    ],
  },
});

module.exports = {
  app,
  server,
  io,
};
