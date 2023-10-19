const express = require("express");
const app = express();
const cors = require("cors");
const port = 80;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  console.log("it is a get request");
  console.log("body", req);
  res.send(`body: ${req.body}// req: ${req}`);
});

app.post("/", (req, res) => {
  console.log("it is a post request");
  console.log("body", req.body);
  console.log("body", req);
  res.send(`body: ${req.body}// req: ${req}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
