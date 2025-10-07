// Gateway Service Entry Point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Proxy routes
app.use(
  "/api/auth",
  createProxyMiddleware({ target: "http://localhost:3001", changeOrigin: true })
);
app.use(
  "/api/users",
  createProxyMiddleware({ target: "http://localhost:3002", changeOrigin: true })
);
app.use(
  "/api/skills",
  createProxyMiddleware({ target: "http://localhost:3003", changeOrigin: true })
);
app.use(
  "/api/matching",
  createProxyMiddleware({ target: "http://localhost:3004", changeOrigin: true })
);
app.use(
  "/api/sessions",
  createProxyMiddleware({ target: "http://localhost:3005", changeOrigin: true })
);
app.use(
  "/api/payments",
  createProxyMiddleware({ target: "http://localhost:3006", changeOrigin: true })
);
app.use(
  "/api/notifications",
  createProxyMiddleware({ target: "http://localhost:3007", changeOrigin: true })
);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "gateway",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway service running on port ${PORT}`);
});
