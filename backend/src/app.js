const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const app = express();

// Middleware chung
app.use(cors());
app.use(express.json());

// Health check để test nhanh
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// middleware bắt lỗi đơn giản
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// --- PHỤC VỤ FRONTEND (DEPLOY) ---
const path = require("path");
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});


module.exports = app;
