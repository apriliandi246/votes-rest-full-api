"use strict";

const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   maximumVote: {
      type: Number,
      required: true,
   },
   object1: {
      title: {
         type: String,
         required: true,
      },
      totalVotes: {
         type: Number,
         required: true,
         default: 0,
      },
   },
   object2: {
      title: {
         type: String,
         required: true,
      },
      totalVotes: {
         type: Number,
         required: true,
         default: 0,
      },
   },
});

module.exports = mongoose.model("Vote", voteSchema);
