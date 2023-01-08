const express = require("express");
const db = require("./db");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/notebook/auth", require("./routes/auth"));
app.use("/notebook/note", require("./routes/note"));

app.listen(port, () => {
  console.log(`connection is successful at ${port}`);
});
