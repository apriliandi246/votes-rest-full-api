"use strict";

module.exports = (app) => {
   app.use("/api/votes", require("../routes/votes"));
};
