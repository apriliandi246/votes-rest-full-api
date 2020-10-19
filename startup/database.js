"use strict";

require("dotenv").config();
const mongoose = require("mongoose");

module.exports = () => {
   mongoose
      .connect(process.env.DB, {
         useCreateIndex: true,
         useNewUrlParser: true,
         useFindAndModify: false,
         useUnifiedTopology: true,
      })
      .then(() => console.log("Connect to Database..."))
      .catch((err) => console.log("Something wrong : ", err));
};
