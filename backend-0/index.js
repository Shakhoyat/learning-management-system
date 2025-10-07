require("dotenv").config();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("Starting backend services...");

const services = [
  { name: "Gateway", path: "gateway/server.js" },
  { name: "Auth Service", path: "services/auth-service/server.js" },
  { name: "User Service", path: "services/user-service/server.js" },
  { name: "Skill Service", path: "services/skill-service/server.js" },
  { name: "Matching Service", path: "services/matching-service/server.js" },
  { name: "Session Service", path: "services/session-service/server.js" },
  { name: "Payment Service", path: "services/payment-service/server.js" },
  {
    name: "Notification Service",
    path: "services/notification-service/server.js",
  },
  { name: "Workers", path: "workers/src/index.js" },
];

services.forEach((service) => {
  const servicePath = path.join(__dirname, service.path);

  if (!fs.existsSync(servicePath)) {
    console.error(
      `[ERROR] Service path not found for ${service.name}: ${servicePath}`
    );
    return;
  }

  const child = spawn("node", [servicePath], {
    stdio: ["inherit", "inherit", "inherit"],
    env: { ...process.env },
  });

  child.on("error", (error) => {
    console.error(`[${service.name}] Error: ${error.message}`);
  });

  child.on("exit", (code, signal) => {
    if (code !== 0) {
      console.warn(
        `[${service.name}] Exited with code ${code} and signal ${signal}`
      );
    }
  });

  console.log(`[INFO] Starting ${service.name}...`);
});
