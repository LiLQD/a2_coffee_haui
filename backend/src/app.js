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

module.exports = app;
