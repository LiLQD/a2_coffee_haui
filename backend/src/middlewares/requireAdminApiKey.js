// backend/src/middlewares/requireAdminApiKey.js

/**
 * Middleware kiểm tra API key admin ở header:
 *   x-admin-apikey: <apiKey>
 * So sánh với ADMIN_API_KEY trong .env
 */
module.exports = function requireAdminApiKey(req, res, next) {
  const apiKey = req.headers["x-admin-apikey"];
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

  console.log("[requireAdminApiKey] clientKey =", apiKey);
  console.log("[requireAdminApiKey] serverKey =", ADMIN_API_KEY);

  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(403).json({
      error: "Không có quyền admin (API key không hợp lệ).",
    });
  }

  next();
};
