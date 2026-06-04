var { MongoClient } = require("mongodb");
var express = require("express");
var jwt = require("jsonwebtoken");
var cors = require("cors");
var multer = require("multer");
var path = require("path");
var fs = require("fs");

var mongoserver = new MongoClient("mongodb://localhost:27017/");
var apiserver = express();
apiserver.use(express.json());
apiserver.use(cors());
apiserver.use("/uploads", express.static(path.join(__dirname, "uploads")));

// create upload folders if not exist
if (!fs.existsSync("uploads/cities")) fs.mkdirSync("uploads/cities", { recursive: true });
if (!fs.existsSync("uploads/attractions")) fs.mkdirSync("uploads/attractions", { recursive: true });

// multer setup for image uploads
// multer setup for image uploads
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cityImage") cb(null, "uploads/cities/");
    else if (file.fieldname === "attractionImages") cb(null, "uploads/attractions/");
    else cb(null, "uploads/");    // ✅ this handles any unexpected field
  },
  filename: (req, file, cb) => {
    var uniquename = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquename + path.extname(file.originalname));
  },
});

// ✅ remove fileFilter completely — it was rejecting unexpected fields
var upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
// secret key for jwt
var secretkey = "123123";


// get all cities
apiserver.get("/cities", async (req, res) => {
  var query = await mongoserver
    .db("apicitiguide")
    .collection("cities")
    .find()
    .toArray();
  if (query) {
    res.json(query);
  } else {
    res.json({ failed: "no cities found" });
  }
});

// add city with image
apiserver.post("/cities/add", upload.single("cityImage"), async (req, res) => {
  var data = req.body;
  data.imageUrl = req.file ? "/uploads/cities/" + req.file.filename : "";
  var query = await mongoserver
    .db("apicitiguide")
    .collection("cities")
    .insertOne(data);
  if (query) {
    res.json({ success: "city added successfully" });
  } else {
    res.json({ failed: "please try again" });
  }
});

// delete city
apiserver.delete("/cities/delete/:id", async (req, res) => {
  var { ObjectId } = require("mongodb");
  var query = await mongoserver
    .db("apicitiguide")
    .collection("cities")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  if (query.deletedCount > 0) {
    res.json({ success: "city deleted successfully" });
  } else {
    res.json({ failed: "city not found" });
  }
});

// get all attractions
apiserver.get("/attractions", async (req, res) => {
  var query = await mongoserver
    .db("apicitiguide")
    .collection("attractions")
    .find()
    .toArray();
  if (query) {
    res.json(query);
  } else {
    res.json({ failed: "no attractions found" });
  }
});

// add attraction with multiple images
apiserver.post("/attractions/add", upload.array("attractionImages", 5), async (req, res) => {
  var data = req.body;
  data.images = req.files ? req.files.map((f) => "/uploads/attractions/" + f.filename) : [];
  var query = await mongoserver
    .db("apicitiguide")
    .collection("attractions")
    .insertOne(data);
  if (query) {
    res.json({ success: "attraction added successfully" });
  } else {
    res.json({ failed: "please try again" });
  }
});

// delete attraction
apiserver.delete("/attractions/delete/:id", async (req, res) => {
  var { ObjectId } = require("mongodb");
  var query = await mongoserver
    .db("apicitiguide")
    .collection("attractions")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  if (query.deletedCount > 0) {
    res.json({ success: "attraction deleted successfully" });
  } else {
    res.json({ failed: "attraction not found" });
  }
});

apiserver.listen(4000);