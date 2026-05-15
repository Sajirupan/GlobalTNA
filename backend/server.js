require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const jobsRouter = require("./routes/jobs");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/globaltna";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// ── Health check ───────────────────────────────────────────────────────────────
app.get("/", (req, res) =>
  res.json({ success: true, message: "GlobalTNA API", version: "1.0.0" })
);

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/jobs", jobsRouter);

// ── 404 ────────────────────────────────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// ── Error handler (must be last) ───────────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────────
let server;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`✅  MongoDB connected`);
    server = app.listen(PORT, () =>
      console.log(`🚀  API running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌  Startup failed:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, start, closeServer: () => server?.close() };
