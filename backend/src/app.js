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

module.exports = app;
