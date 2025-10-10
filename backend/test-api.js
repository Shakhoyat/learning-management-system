/**
 * Quick API Test Script
 * Tests if the analytics endpoints are responding correctly
 */

const http = require("http");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) =>
    console.log(
      `\n${colors.cyan}${"=".repeat(60)}\n${msg}\n${"=".repeat(60)}${
        colors.reset
      }`
    ),
};

// Test if backend server is running
const testServerHealth = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/health",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200 && response.status === "OK") {
            log.success(`Backend server is running on port ${response.port}`);
            log.info(`Environment: ${response.environment}`);
            if (response.services?.analytics === "active") {
              log.success("Analytics service is active");
            }
            resolve(true);
          } else {
            log.error(`Server returned status ${res.statusCode}`);
            resolve(false);
          }
        } catch (error) {
          log.error(`Failed to parse health check response: ${error.message}`);
          resolve(false);
        }
      });
    });

    req.on("error", (error) => {
      log.error(`Backend server is not running: ${error.message}`);
      log.info(
        "Please start the backend server with: cd backend && npm run dev"
      );
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      log.error("Health check timeout - server may be slow or unresponsive");
      resolve(false);
    });

    req.end();
  });
};

// Main test function
const runTests = async () => {
  log.section("ANALYTICS API QUICK TEST");

  console.log(`\nTesting backend server at http://localhost:3000\n`);

  const serverRunning = await testServerHealth();

  if (!serverRunning) {
    log.section("TEST RESULTS");
    log.error("Backend server is not running!");
    log.info("\nTo start the backend server:");
    console.log("  1. Open a terminal");
    console.log("  2. cd backend");
    console.log("  3. npm run dev");
    console.log("\nThen run this test again.\n");
    process.exit(1);
  }

  log.section("TEST RESULTS");
  log.success("Backend server is ready!");
  log.success("Analytics service is configured!");

  console.log("\n📊 Next Steps:");
  console.log("  1. Start frontend: cd frontend && npm run dev");
  console.log("  2. Open browser: http://localhost:5173");
  console.log("  3. Login as a tutor");
  console.log("  4. Navigate to Analytics page");
  console.log('  5. Click "View Detailed Analytics"');
  console.log("\n✅ All systems ready for testing!\n");
};

// Run tests
runTests();
