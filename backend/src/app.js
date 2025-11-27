const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
require("dotenv").config();

=======
>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
const routes = require("./routes");

const app = express();

<<<<<<< HEAD
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

=======
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

>>>>>>> 5ab40d942e35bf6b135285a6ae9564ea86848a0f
module.exports = app;
