const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const jwtsecret = "SaB@rNai$@go0DbOy";

const fetchuser = require("../middleware/fetchuser");

const { body, validationResult } = require("express-validator");

router.post(
  "/",
  [
    body("name", "Enter Valid Name").isLength({ min: 3 }),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password must be atleast 3 char").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // console.log(req.body);
      let err = await User.findOne({ email: req.body.email });
      if (err) {
        return res.status(400).json({ error: "Email Id Already exists" });
      }

      // const user = User(req.body);
      // const newuser = await user.save();
      // console.log(user);
      // res.status(200).send(newuser);
      const salt = await bcrypt.genSalt(10);
      const secretpassword = await bcrypt.hash(req.body.password, salt);
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secretpassword,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      const jwttoken = jwt.sign(data, jwtsecret);
      // console.log(jwttoken);
      res.json({ jwttoken });
    } catch (error) {
      // message : "fuck off"
      res.status(400).send("fuck off");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      const pwcmp = await bcrypt.compare(password, user.password);
      if (!pwcmp) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      const jwttoken = jwt.sign(data, jwtsecret);
      res.json({ jwttoken });
    } catch (error) {
      res.status(400).send("Internal Server Error");
    }
  }
);

router.post("/userdetails", fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;
    const maindata = await User.findById(userID).select("-password");
    res.send(maindata);
  } catch (error) {
    res.status(400).send("Internal Server Error");
  }
});

module.exports = router;
