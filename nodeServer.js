const express = require("express");
const app = express();
const path = require("path");

app.use("/", express.static(path.join(__dirname, "/dist")));
const serverPort = 3050;

app.listen(serverPort, function() {
  console.log(`listening on ${serverPort}`);
});
