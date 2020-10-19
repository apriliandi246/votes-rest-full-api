"use strict";

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

require("./startup/database")();

module.exports = { io };

app.use((req, res, next) => {
   req.io = io;
   next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./startup/cors")(app);
require("./startup/routes")(app);

http.listen(4000, () => {
   console.log(`Server started on 4000`);
});
