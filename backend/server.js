var { MongoClient } = require("mongodb");
var express = require("express");
var jwt = require("jsonwebtoken");
var cors = require("cors");

var mongoserver = new MongoClient("mongodb://localhost:27017/");
var apiserver = express();
apiserver.use(express.json());
apiserver.use(cors());

// register api
apiserver.post("/register", async (req, res) => {
  var data = req.body;
  var query = await mongoserver
    .db("apicitiguide")
    .collection("users")
    .insertOne(data);
  if (query) {
    res.json({ success: "you are successfully register" });
  } else {
    res.json({ failed: "please try again" });
  }
});
// login api
var secretkey = "123123";
apiserver.post("/login", async (req, res) => {
  var data = req.body;
  var query = await mongoserver.db("apicitiguide").collection("users").findOne({
    email: data.email,
    password: data.password,
  });

  if (query) {
    var token = jwt.sign({ email: data.email }, secretkey);
    res.json({ message: "you are successfully login", token: token });
  } else {
    res.json({ Error: "Invalid Credentials" });
  }
});

//middleware for api

function middlewareforapi(req, res, next) {
  var authHeader = req.headers.authorization;

  if (authHeader) {
    var token = authHeader.split(" ")[1];

    jwt.verify(token, secretkey);
    next();
  } else {
    res.json({ error: "token not found" });
  }
}



apiserver.get("/test",middlewareforapi, async (req, res) => {
  try {
    const query = await mongoserver
      .db("apicitiguide")
      .collection("users")
      .find()
      .toArray();

    res.json(query);

  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
      details: error.message
    });
  }
})

apiserver.listen(4000);
