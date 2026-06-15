require("dotenv").config();
var { MongoClient, ObjectId } = require("mongodb");
var express = require("express");
var jwt = require("jsonwebtoken");
var cors = require("cors");
var multer = require("multer");
var nodemailer = require("nodemailer");
var path = require("path");
var fs = require("fs");

// ─── DATABASE & SERVER SETUP ─────────────────────────────────────────────────
// Connect to local MongoDB and create the Express app
var mongoserver = new MongoClient("mongodb://localhost:27017/");
var apiserver = express();
apiserver.use(express.json());
apiserver.use(cors());
// Serve uploaded images as static files at /uploads URL path
apiserver.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads folder on startup if it doesn't exist
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ─── FILE UPLOAD CONFIG (MULTER) ─────────────────────────────────────────────
// Saves uploaded images to the /uploads folder with a timestamp-based filename
var storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, "uploads/"); },
  filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)); },
});
var upload = multer({ storage: storage });

// JWT secret key — read from .env file, falls back to a default
var secretkey = process.env.JWT_SECRET || "citiguide_secret_2024";

// ─── EMAIL CONFIG (NODEMAILER) ────────────────────────────────────────────────
// Gmail transporter used to send OTP emails for password reset
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,       // your Gmail address in .env
    pass: process.env.APP_PASSWORD, // Gmail App Password in .env (not your real password)
  },
});

// Sends a styled OTP email to the given address
function sendOtpEmail(toEmail, otp) {
  return transporter.sendMail({
    from: `"APP-CityGuide" <${process.env.EMAIL}>`,
    to: toEmail,
    subject: "Your Password Reset OTP - APP-CityGuide",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8f9fa;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h2 style="color:#4361ee;margin:0;font-size:24px;">APP-CityGuide</h2>
          <p style="color:#666;margin:4px 0 0;font-size:13px;">Password Reset Request</p>
        </div>
        <div style="background:#fff;border-radius:10px;padding:28px;border:1px solid #e9ecef;">
          <p style="color:#333;font-size:15px;margin:0 0 16px;">Hi there,</p>
          <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
            We received a request to reset your password. Use the OTP below to continue.
            This code is valid for <strong>10 minutes</strong>.
          </p>
          <div style="text-align:center;margin:28px 0;">
            <div style="display:inline-block;background:linear-gradient(135deg,#4361ee,#7b2ff7);padding:18px 40px;border-radius:12px;">
              <span style="font-size:36px;font-weight:bold;color:#fff;letter-spacing:10px;">${otp}</span>
            </div>
          </div>
          <p style="color:#888;font-size:12px;line-height:1.6;margin:24px 0 0;">
            If you didn't request a password reset, you can safely ignore this email.
            Never share this OTP with anyone.
          </p>
        </div>
        <p style="text-align:center;color:#aaa;font-size:11px;margin-top:20px;">
          © ${new Date().getFullYear()} APP-CityGuide. All rights reserved.
        </p>
      </div>
    `,
  });
}

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

// Protects routes that require a logged-in user.
// Reads the JWT from the Authorization header and attaches the decoded user to req.user.
function middlewareforapi(req, res, next) {
  var authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ error: "token not found" });
  var token = authHeader.split(" ")[1];
  try {
    var decoded = jwt.verify(token, secretkey);
    req.user = decoded;
    next();
  } catch (e) {
    res.json({ error: "invalid token" });
  }
}

// Protects routes that require admin access only.
// Same as middlewareforapi but also checks that the user's role === "admin".
function adminMiddleware(req, res, next) {
  var authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ error: "token not found" });
  var token = authHeader.split(" ")[1];
  try {
    var decoded = jwt.verify(token, secretkey);
    if (decoded.role !== "admin") return res.json({ error: "admin access required" });
    req.user = decoded;
    next();
  } catch (e) {
    res.json({ error: "invalid token" });
  }
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

// POST /register — Create a new user account.
// Body: { firstname, lastname, email, password, ... }
// Rejects if the email is already registered. Assigns role = "user" by default.
apiserver.post("/register", async (req, res) => {
  var data = req.body;
  var existing = await mongoserver.db("apicitiguide").collection("users").findOne({ email: data.email });
  if (existing) return res.json({ failed: "Email already registered" });
  data.role = "user";
  data.createdAt = new Date();
  await mongoserver.db("apicitiguide").collection("users").insertOne(data);
  res.json({ success: "You are successfully registered" });
});

// POST /login — Log in with email and password.
// Returns a JWT token, user role, name, and email on success.
// The token must be sent in the Authorization header for protected routes.
apiserver.post("/login", async (req, res) => {
  var data = req.body;
  var query = await mongoserver.db("apicitiguide").collection("users").findOne({
    email: data.email,
    password: data.password,
  });
  if (!query) return res.json({ Error: "Invalid Credentials" });
  var token = jwt.sign(
    { email: data.email, role: query.role, id: query._id.toString() },
    secretkey
  );
  res.json({
    message: "Login successful",
    token,
    Role: query.role,
    name: (query.firstname || "") + " " + (query.lastname || ""),
    email: query.email,
  });
});

// ─── PROFILE ─────────────────────────────────────────────────────────────────

// GET /profile — Get the logged-in user's profile data (password is excluded).
// Requires: valid user JWT in Authorization header.
apiserver.get("/profile", middlewareforapi, async (req, res) => {
  var user = await mongoserver.db("apicitiguide").collection("users").findOne({ email: req.user.email });
  if (!user) return res.json({ error: "User not found" });
  delete user.password;
  res.json(user);
});

// PUT /profile — Update the logged-in user's profile fields.
// Requires: valid user JWT. Cannot change password, role, or _id through this route.
apiserver.put("/profile", middlewareforapi, async (req, res) => {
  var data = req.body;
  delete data.password;
  delete data.role;
  delete data._id;
  await mongoserver.db("apicitiguide").collection("users").updateOne(
    { email: req.user.email },
    { $set: data }
  );
  res.json({ success: "Profile updated" });
});

// ─── CITIES ──────────────────────────────────────────────────────────────────

// GET /cities — Get the list of all cities. Public — no login required.
apiserver.get("/cities", async (req, res) => {
  var cities = await mongoserver.db("apicitiguide").collection("cities").find().toArray();
  res.json(cities);
});

// POST /cities — Add a new city. Admin only.
// Body: form-data with city fields + optional image file (field name: "image").
apiserver.post("/cities", adminMiddleware, upload.single("image"), async (req, res) => {
  var data = req.body;
  if (req.file) data.image = "/uploads/" + req.file.filename;
  data.createdAt = new Date();
  var result = await mongoserver.db("apicitiguide").collection("cities").insertOne(data);
  res.json({ success: true, id: result.insertedId });
});

// DELETE /cities/:id — Delete a city by its MongoDB _id. Admin only.
apiserver.delete("/cities/:id", adminMiddleware, async (req, res) => {
  await mongoserver.db("apicitiguide").collection("cities").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

// ─── ATTRACTIONS ─────────────────────────────────────────────────────────────

// GET /attractions — Get all attractions. Public.
// Optional query params: ?city=CityName  and/or  ?category=CategoryName  to filter results.
apiserver.get("/attractions", async (req, res) => {
  var filter = {};
  if (req.query.city) filter.city = req.query.city;
  if (req.query.category) filter.category = req.query.category;
  var attractions = await mongoserver.db("apicitiguide").collection("attractions").find(filter).toArray();
  res.json(attractions);
});

// GET /attractions/search — Search attractions by keyword and/or category. Public.
// Query params: ?q=keyword  and/or  ?category=CategoryName
// Searches across name, description, city, and category fields (case-insensitive).
// NOTE: This route must be defined BEFORE /attractions/:id to avoid "search" being treated as an id.
apiserver.get("/attractions/search", async (req, res) => {
  var keyword = req.query.q || "";
  var category = req.query.category || "";
  var filter = {};
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { city: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  var results = await mongoserver.db("apicitiguide").collection("attractions").find(filter).toArray();
  res.json(results);
});

// GET /attractions/:id — Get a single attraction by its MongoDB _id. Public.
apiserver.get("/attractions/:id", async (req, res) => {
  try {
    var attraction = await mongoserver.db("apicitiguide").collection("attractions")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(attraction || { error: "Not found" });
  } catch (e) {
    res.json({ error: "Not found" });
  }
});

// POST /attractions — Add a new attraction. Admin only.
// Body: form-data with attraction fields + optional image file (field name: "image").
// Starts with rating = 0 and reviewCount = 0.
apiserver.post("/attractions", adminMiddleware, upload.single("image"), async (req, res) => {
  var data = req.body;
  if (req.file) data.image = "/uploads/" + req.file.filename;
  data.createdAt = new Date();
  data.rating = 0;
  data.reviewCount = 0;
  var result = await mongoserver.db("apicitiguide").collection("attractions").insertOne(data);
  res.json({ success: true, id: result.insertedId });
});

// PUT /attractions/:id — Update an existing attraction by its _id. Admin only.
// Body: form-data with the fields to update + optional new image file.
apiserver.put("/attractions/:id", adminMiddleware, upload.single("image"), async (req, res) => {
  var data = req.body;
  if (req.file) data.image = "/uploads/" + req.file.filename;
  delete data._id;
  await mongoserver.db("apicitiguide").collection("attractions").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: data }
  );
  res.json({ success: true });
});

// DELETE /attractions/:id — Delete an attraction by its _id. Admin only.
apiserver.delete("/attractions/:id", adminMiddleware, async (req, res) => {
  await mongoserver.db("apicitiguide").collection("attractions").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

// POST /attractions/bulk — Insert multiple attractions at once from a JSON array. Admin only.
// Body: JSON array of attraction objects. Each item must have at least "name" and "city".
// Useful for seeding the database from a spreadsheet or external data source.
apiserver.post("/attractions/bulk", adminMiddleware, async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items) || items.length === 0)
    return res.json({ error: "No data provided" });

  const prepared = items.map((item) => ({
    name: item.name || "",
    city: item.city || "",
    category: item.category || "Attraction",
    description: item.description || "",
    openingHours: item.openingHours || item.opening_hours || "",
    phone: item.phone || "",
    website: item.website || "",
    image: item.imageUrl || item.image || "",
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
  })).filter((item) => item.name && item.city);

  if (prepared.length === 0)
    return res.json({ error: "No valid rows (name and city required)" });

  const result = await mongoserver.db("apicitiguide").collection("attractions").insertMany(prepared);
  res.json({ success: true, inserted: result.insertedCount });
});

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

// GET /reviews — Get all reviews across all attractions, sorted newest first. Public.
// Used by the admin dashboard to manage/moderate reviews.
apiserver.get("/reviews", async (req, res) => {
  var reviews = await mongoserver.db("apicitiguide").collection("reviews")
    .find().sort({ createdAt: -1 }).toArray();
  res.json(reviews);
});

// GET /reviews/:attractionId — Get all reviews for a specific attraction. Public.
// attractionId is the string _id of the attraction (not a MongoDB ObjectId here).
apiserver.get("/reviews/:attractionId", async (req, res) => {
  var reviews = await mongoserver.db("apicitiguide").collection("reviews")
    .find({ attractionId: req.params.attractionId })
    .sort({ createdAt: -1 })
    .toArray();
  res.json(reviews);
});

// POST /reviews — Submit a review for an attraction. Requires login.
// Body: { attractionId, rating (1-5), comment, ... }
// After saving, recalculates and updates the attraction's average rating and review count.
apiserver.post("/reviews", middlewareforapi, async (req, res) => {
  var data = req.body;
  data.userEmail = req.user.email;
  data.createdAt = new Date();
  data.likes = 0;
  data.rating = parseInt(data.rating) || 5;
  await mongoserver.db("apicitiguide").collection("reviews").insertOne(data);

  // Recalculate average rating for the attraction
  var allReviews = await mongoserver.db("apicitiguide").collection("reviews")
    .find({ attractionId: data.attractionId }).toArray();
  var avg = allReviews.reduce((s, r) => s + (r.rating || 0), 0) / allReviews.length;
  await mongoserver.db("apicitiguide").collection("attractions").updateOne(
    { _id: new ObjectId(data.attractionId) },
    { $set: { rating: Math.round(avg * 10) / 10, reviewCount: allReviews.length } }
  );
  res.json({ success: true });
});

// DELETE /reviews/:id — Delete a review by its _id. Admin only.
apiserver.delete("/reviews/:id", adminMiddleware, async (req, res) => {
  await mongoserver.db("apicitiguide").collection("reviews").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

// ─── ADMIN: USERS ─────────────────────────────────────────────────────────────

// GET /users — Get all registered users (passwords excluded). Admin only.
// Used by the admin dashboard to view and manage user accounts.
apiserver.get("/users", adminMiddleware, async (req, res) => {
  var users = await mongoserver.db("apicitiguide").collection("users").find().toArray();
  users.forEach(u => delete u.password);
  res.json(users);
});

// DELETE /users/:id — Delete a user account by its _id. Admin only.
apiserver.delete("/users/:id", adminMiddleware, async (req, res) => {
  await mongoserver.db("apicitiguide").collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

// ─── ADMIN: STATS ────────────────────────────────────────────────────────────

// GET /stats — Get total counts of users, attractions, reviews, and cities. Admin only.
// Used by the admin dashboard overview/summary cards.
apiserver.get("/stats", adminMiddleware, async (req, res) => {
  var [users, attractions, reviews, cities] = await Promise.all([
    mongoserver.db("apicitiguide").collection("users").countDocuments(),
    mongoserver.db("apicitiguide").collection("attractions").countDocuments(),
    mongoserver.db("apicitiguide").collection("reviews").countDocuments(),
    mongoserver.db("apicitiguide").collection("cities").countDocuments(),
  ]);
  res.json({ users, attractions, reviews, cities });
});

// ─── FORGOT PASSWORD / OTP ───────────────────────────────────────────────────

// POST /forgot-password — Request a password reset OTP. Public.
// Body: { email }
// Generates a 6-digit OTP valid for 10 minutes and emails it to the user.
apiserver.post("/forgot-password", async (req, res) => {
  var { email } = req.body;
  if (!email) return res.json({ error: "Email is required" });

  var user = await mongoserver.db("apicitiguide").collection("users").findOne({ email });
  if (!user) return res.json({ error: "No account found with this email" });

  var otp = Math.floor(100000 + Math.random() * 900000).toString();
  var expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Delete any existing OTP for this email before creating a new one
  await mongoserver.db("apicitiguide").collection("otps").deleteMany({ email });
  await mongoserver.db("apicitiguide").collection("otps").insertOne({ email, otp, expiresAt, used: false });

  try {
    await sendOtpEmail(email, otp);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (e) {
    console.error("Email error:", e.message);
    res.json({ error: "Failed to send email. Check server config." });
  }
});

// POST /verify-otp — Verify that the OTP entered by the user is correct and not expired. Public.
// Body: { email, otp }
// Frontend calls this before showing the new-password form.
apiserver.post("/verify-otp", async (req, res) => {
  var { email, otp } = req.body;
  var record = await mongoserver.db("apicitiguide").collection("otps").findOne({ email, otp, used: false });

  if (!record) return res.json({ error: "Invalid OTP" });
  if (new Date() > new Date(record.expiresAt))
    return res.json({ error: "OTP has expired. Request a new one." });

  res.json({ success: true, message: "OTP verified" });
});

// POST /reset-password — Set a new password after OTP verification. Public.
// Body: { email, otp, newPassword }
// Validates the OTP again, updates the password, then clears the OTP record.
apiserver.post("/reset-password", async (req, res) => {
  var { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.json({ error: "All fields required" });

  var record = await mongoserver.db("apicitiguide").collection("otps").findOne({ email, otp, used: false });
  if (!record) return res.json({ error: "Invalid or expired OTP" });
  if (new Date() > new Date(record.expiresAt)) return res.json({ error: "OTP expired. Start over." });

  await mongoserver.db("apicitiguide").collection("users").updateOne({ email }, { $set: { password: newPassword } });
  await mongoserver.db("apicitiguide").collection("otps").deleteMany({ email });

  res.json({ success: true, message: "Password reset successfully" });
});

// ─── START ───────────────────────────────────────────────────────────────────

apiserver.listen(4000, () => console.log("Server running on http://localhost:4000"));
