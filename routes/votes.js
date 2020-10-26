"use strict";

const router = require("express").Router();
const mongoose = require("mongoose");
const Vote = require("../models/votes");
const { io } = require("../index");

io.on("connection", (socket) => {
   if (socket.connected === true) {
      socket.on("voting", async ([data, id]) => {
         const vote = await Vote.findByIdAndUpdate(id, data, {
            new: true,
         });

         vote.save();

         io.emit("voting", vote);
      });
   }

   socket.on("voting", async ([data, id]) => {
      const vote = await Vote.findByIdAndUpdate(id, data, {
         new: true,
      });

      vote.save();

      io.emit("voting", vote);
   });
});

// get all votes, that vote have not already voted
router.get("/", async (req, res) => {
   const votes = await Vote.find().sort({ createdAt: "desc" });
   const result = votes.filter(
      (vote) =>
         vote.object1.totalVotes !== vote.maximumVote &&
         vote.object2.totalVotes !== vote.maximumVote
   );

   res.send(result);
});

// get all votes, that vote have already voted
router.get("/voted", async (req, res) => {
   const votes = await Vote.find().sort({ createdAt: "desc" });
   const result = votes.filter(
      (vote) =>
         vote.object1.totalVotes === vote.maximumVote ||
         vote.object2.totalVotes === vote.maximumVote
   );

   res.send(result);
});

router.get("/:id", async (req, res) => {
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({
         message: "Invalid ID....",
         status: res.statusCode,
      });
   }

   const vote = await Vote.findById(req.params.id);
   checkData(vote, res);
   res.send(vote);
});

router.post("/", async (req, res) => {
   const newVote = new Vote({
      title: req.body.title,
      description: req.body.description,
      maximumVote: req.body.maximumVote,
      object1: req.body.object1,
      object2: req.body.object2,
   });

   await newVote.save();

   res.send({
      message: "Vote has created....",
      status: res.statusCode,
   });
});

router.put("/:id", async (req, res) => {
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({
         message: "Invalid ID....",
         status: res.statusCode,
      });
   }

   const vote = await Vote.findByIdAndUpdate(
      req.params.id,
      {
         title: req.body.title,
         description: req.body.description,
         maximumVote: req.body.maximumVote,
         object1: req.body.object1,
         object2: req.body.object2,
      },
      {
         new: true,
      }
   );

   checkData(vote, res);

   await vote.save();

   res.send(vote);
});

router.delete("/:id", async (req, res) => {
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({
         message: "Invalid ID....",
         status: res.statusCode,
      });
   }

   const vote = await Vote.findByIdAndDelete(req.params.id);

   checkData(vote, res);

   res.send({
      message: "Vote has deleted....",
      status: res.statusCode,
   });
});

function checkData(data, response) {
   if (!data || data.length === 0) {
      return response.status(404).send({
         message: "Vote is not found....",
         status: response.statusCode,
      });
   }
}

module.exports = router;
