const express = require("express");
const router = express.Router();
const notes = require("../models/Notes");

var jwt = require("jsonwebtoken");
const jwtsecret = "SaB@rNai$@go0DbOy";

const fetchuser = require("../middleware/fetchuser");

const { body, validationResult } = require("express-validator");

router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    // console.log( req.user.id);
    const notedata = await notes.find({ user: req.user.id });
    // console.log(notedata);
    res.json(notedata);
  } catch (error) {
    // console.log("hm");
    res.status(401).send(error);
  }
});

router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "title must be atleast of 3 letters").isLength({ min: 3 }),
    body("description", "description must be atleast 3 char").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    try {
      // console.log("hw");
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { title, description } = req.body;

      const note = new notes({
        title,
        description,
        user: req.user.id,
      });

      const saveddata = await note.save();
      res.json(saveddata);
    } catch (error) {
      res.status(401).send(error);
    }
  }
);

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newData = {};
    if (title) {
      newData.title = title;
    }
    if (description) {
      newData.description = description;
    }
    const updatenotedata = await notes.findById(req.params.id);
    if (!updatenotedata) {
      return res.status(404).send("Not Found");
    }

    if (updatenotedata.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    updatenotedata = await notes.findByIdAndUpdate(
      req.params.id,
      { $set: newData },
      { new: true }
    );
    res.json(updatenotedata);
  } catch (error) {
    res.status(401).send(error);
  }
});
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const deletenotedata = await notes.findById(req.params.id);
    if (!deletenotedata) {
      return res.status(404).send("Not Found");
    }

    if (deletenotedata.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    deletenotedata = await notes.findByIdAndDelete(req.params.id);
    res.send("Success");
  } catch (error) {
    res.status(401).send(error);
  }
});

module.exports = router;
