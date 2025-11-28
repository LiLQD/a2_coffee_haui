// src/modules/auth/auth.routes.js
const express = require("express");
const { handleLogin } = require("./auth.controller");

const router = express.Router();

// POST /api/auth/login
router.post("/login", handleLogin);

module.exports = router;
