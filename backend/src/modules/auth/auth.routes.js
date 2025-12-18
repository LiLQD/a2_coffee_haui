// src/modules/auth/auth.routes.js
const express = require("express");
const { handleLogin, handleRegister } = require("./auth.controller");

const router = express.Router();

// POST /api/auth/login
router.post("/login", handleLogin);

// POST /api/auth/register
router.post("/register", handleRegister);

module.exports = router;
