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

function createMockXml(fromUser) {
  const date = Date.now();
  console.log("process.env.TOUSER",process.env.TOUSER)
  const response = `<xml>
  <ToUserName><![CDATA[${process.env.TOUSER}]]></ToUserName>
  <FromUserName><![CDATA[${fromUser}]]></FromUserName>
  <CreateTime>${date}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[Hello test]]></Content>
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
  //   req query {
  //       signature: '28dbd8a592d8473817501cdd63f04dcb8a3766d1',
  //       timestamp: '1697978063',
  //       nonce: '1067812682',
  //       openid: 'o4TP_6mVou0U-OTTM78dlV4g26Zc',
  //       encrypt_type: 'aes',
  //       msg_signature: 'e745125a6c20e33836ee75c68bf2787310bf6809'
  //     }
  console.log("req.read()", req.read());
  res.send(createMockXml(req.query.openid));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
