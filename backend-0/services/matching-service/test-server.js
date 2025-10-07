const express = require("express");
const app = express();
const PORT = 3004;

app.use(express.json());

// Test endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "matching-service",
    timestamp: new Date().toISOString(),
  });
});

// Test matching endpoint
app.get("/api/matching/test", (req, res) => {
  res.json({
    message: "Matching service is working",
    service: "matching-service",
    endpoints: ["GET /api/health", "GET /api/matching/test"],
  });
});

app.listen(PORT, () => {
  console.log(`Matching service running on port ${PORT}`);
});
