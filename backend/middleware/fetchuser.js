var jwt = require("jsonwebtoken");
const jwtsecret = "SaB@rNai$@go0DbOy";

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("jwttoken");
    if (!token) {
      return res.status(401).send({ error: "Invalid token" });
    }
    // console.log(token);
    const data = jwt.verify(token, jwtsecret);
    // console.log(data);
    req.user = data.user;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

module.exports = fetchuser;
