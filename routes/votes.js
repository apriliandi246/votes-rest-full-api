"use strict";

const router = require("express").Router();
const validateId = require("../middleware/validationId");
const Vote = require("../models/votes");
const { io } = require("../index");

router.get("/", async (req, res) => {
   const votes = await Vote.find().sort({ createdAt: "desc" });
   res.send(votes);
});

router.get("/:id", validateId, async (req, res) => {
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

   res.send({
      message: "Vote has updated....",
      status: res.statusCode,
   });
});

router.delete("/:id", async (req, res) => {
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
