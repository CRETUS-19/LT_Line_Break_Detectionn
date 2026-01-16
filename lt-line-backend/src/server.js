const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Firebase Admin Init
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://YOUR_PROJECT.firebaseio.com"
});

const db = admin.database();

// MongoDB Connection
mongoose.connect("YOUR_MONGODB_URI")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const PoleDataSchema = new mongoose.Schema({
  pole_id: String,
  voltage: Number,
  current: Number,
  status: String,
  timestamp: Date
});

const PoleData = mongoose.model("PoleData", PoleDataSchema);

// API to receive sensor data
app.post("/api/pole-data", async (req, res) => {
  const { pole_id, voltage, current, lat, lng } = req.body;

  let status = "NORMAL";
  if (voltage < 50 || current === 0) {
    status = "FAULT";
  }

  // Save live data to Firebase
  await db.ref(`poles/${pole_id}`).set({
    voltage,
    current,
    lat,
    lng,
    status,
    updatedAt: new Date().toISOString()
  });

  // Save history to MongoDB
  await PoleData.create({
    pole_id,
    voltage,
    current,
    status,
    timestamp: new Date()
  });

  res.json({ message: "Data received", status });
});

app.get("/", (req, res) => {
  res.send("LT Line Backend Running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));