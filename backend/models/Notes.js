const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const notesschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const notes = new mongoose.model("notes", notesschema);

module.exports = notes;
