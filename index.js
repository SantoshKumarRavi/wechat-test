const express = require("express");
const crypto = require("crypto");
const app = express();
const cors = require("cors");
const port = 80;

app.use(
  cors({
    origin: "*",
  })
);

function checkSignature(req) {
  const signature = req.query.signature;
  const timestamp = req.query.timestamp;
  const nonce = req.query.nonce;

  const token = "abcabc"; // Assuming TOKEN is an environment variable
  const tmpArr = [token, timestamp, nonce];
  tmpArr.sort();
  const tmpStr = tmpArr.join("");
  const tmpStrSha1 = crypto.createHash("sha1").update(tmpStr).digest("hex");

  if (tmpStrSha1 === signature) {
    return true;
  } else {
    return false;
  }
}

app.use((req, res, next) => {
  console.log("logged on Time:", Date.now());
  console.log("req", req.body);
  console.log("req", req.query);
  console.log("res", res);
  if (checkSignature(req)) {
    next();
  } else {
    res.send("unauthorized");
  }
});

app.get("/", (req, res) => {
  console.log("it is a get request");
  res.send(`body: ${req.body}`);
});

app.post("/", (req, res) => {
  console.log("it is a post request");
  console.log("body", req.body);
  console.log("body", req);
  res.send(`body: ${req.body}// req:`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
