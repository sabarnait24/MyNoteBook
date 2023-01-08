const mongoose = require("mongoose");
const { Schema } = mongoose;

const validator = require("validator");

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = new mongoose.model("User", userschema);

module.exports = User;
