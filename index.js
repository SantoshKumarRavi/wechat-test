const express = require("express");
const crypto = require("crypto");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

const port = 80;
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
app.use(
  cors({
    origin: "*",
  })
);

function checkSignature(req) {
  const signature = req.query.signature;
  const timestamp = req.query.timestamp;
  const nonce = req.query.nonce;
  const token = process.env.TOKEN; // Assuming TOKEN is an environment variable
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
//ref https://stackoverflow.com/questions/37338249/wechat-sandbox-unable-to-configure-setting-url-and-token
app.get("/wechat", function (req, res) {
  console.log("GET in wechat");
  res.send(req.query.echostr);
});

app.use((req, res, next) => {
  console.log("logged on Time:", Date.now());
  console.log("req body", req.body);
  console.log("req query", req.query);
  console.log("req method", req.method);
  if (checkSignature(req)) {
    console.log("confirmed");
    next();
  } else {
    console.log("un_confirmed");
    res.send("unauthorized");
  }
});

function createMockXml() {
  const date = Date.now();
  const response = `<xml>
  <ToUserName><![CDATA[toUser]]></ToUserName>
  <FromUserName><![CDATA[fromUser]]></FromUserName>
  <CreateTime>${date}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[Hello]]></Content>
</xml>`;
  return response;
}
app.get("/", (req, res) => {
  console.log("it is a get request");
  res.send(req.query.echostr);
});

app.post("/", (req, res) => {
  console.log("it is a post request");
  console.log("body", req.body);
  console.log("body", req);
  res.send(createMockXml());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
