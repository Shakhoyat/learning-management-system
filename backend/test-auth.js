/**
 * Authentication System Test Script
 * Tests registration, login, and authentication security
 */

const http = require("http");
const https = require("https");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) =>
    console.log(
      `\n${colors.cyan}${"=".repeat(60)}\n${msg}\n${"=".repeat(60)}${
        colors.reset
      }`
    ),
  subsection: (msg) =>
    console.log(`\n${colors.magenta}--- ${msg} ---${colors.reset}`),
};

const BASE_URL = "http://localhost:3000";

// Helper function to make HTTP requests
const makeRequest = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData,
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

// Test server health
const testServerHealth = async () => {
  try {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/health",
      method: "GET",
    };

    const response = await makeRequest(options);
    if (response.statusCode === 200) {
      log.success("Backend server is running");
      return true;
    } else {
      log.error("Backend server health check failed");
      return false;
    }
  } catch (error) {
    log.error(`Cannot connect to backend server: ${error.message}`);
    return false;
  }
};

// Test user registration
const testRegistration = async () => {
  log.subsection("Testing User Registration");

  const testCases = [
    {
      name: "Valid registration",
      data: {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "SecurePass123!",
        role: "learner",
      },
      expectedStatus: 201,
    },
    {
      name: "Missing required fields",
      data: {
        email: "missing@example.com",
        // Missing name and password
      },
      expectedStatus: 400,
    },
    {
      name: "Invalid email format",
      data: {
        name: "Test User",
        email: "invalid-email",
        password: "SecurePass123!",
      },
      expectedStatus: 400,
    },
    {
      name: "Weak password",
      data: {
        name: "Test User",
        email: `weak${Date.now()}@example.com`,
        password: "123",
      },
      expectedStatus: 400,
    },
  ];

  const results = [];

  for (const testCase of testCases) {
    try {
      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await makeRequest(options, testCase.data);

      if (response.statusCode === testCase.expectedStatus) {
        log.success(`${testCase.name}: Passed`);
        results.push({ test: testCase.name, status: "PASS" });
      } else {
        log.error(
          `${testCase.name}: Failed (Expected ${testCase.expectedStatus}, got ${response.statusCode})`
        );
        results.push({ test: testCase.name, status: "FAIL" });
      }
    } catch (error) {
      log.error(`${testCase.name}: Error - ${error.message}`);
      results.push({ test: testCase.name, status: "ERROR" });
    }
  }

  return results;
};

// Test user login
const testLogin = async () => {
  log.subsection("Testing User Login");

  // First, create a test user
  const testUser = {
    name: "Login Test User",
    email: `logintest${Date.now()}@example.com`,
    password: "SecurePass123!",
    role: "learner",
  };

  try {
    const registerOptions = {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const registerResponse = await makeRequest(registerOptions, testUser);

    if (registerResponse.statusCode !== 201) {
      log.error("Failed to create test user for login tests");
      return [];
    }

    log.info("Test user created successfully");

    const testCases = [
      {
        name: "Valid login",
        data: {
          email: testUser.email,
          password: testUser.password,
        },
        expectedStatus: 200,
      },
      {
        name: "Invalid email",
        data: {
          email: "nonexistent@example.com",
          password: testUser.password,
        },
        expectedStatus: 401,
      },
      {
        name: "Invalid password",
        data: {
          email: testUser.email,
          password: "wrongpassword",
        },
        expectedStatus: 401,
      },
      {
        name: "Missing credentials",
        data: {
          email: testUser.email,
          // Missing password
        },
        expectedStatus: 400,
      },
    ];

    const results = [];

    for (const testCase of testCases) {
      try {
        const options = {
          hostname: "localhost",
          port: 3000,
          path: "/api/auth/login",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await makeRequest(options, testCase.data);

        if (response.statusCode === testCase.expectedStatus) {
          log.success(`${testCase.name}: Passed`);
          results.push({ test: testCase.name, status: "PASS" });

          // Check for JWT tokens in successful login
          if (
            testCase.expectedStatus === 200 &&
            response.data.data &&
            response.data.data.tokens
          ) {
            log.info("JWT tokens present in response");
          }
        } else {
          log.error(
            `${testCase.name}: Failed (Expected ${testCase.expectedStatus}, got ${response.statusCode})`
          );
          results.push({ test: testCase.name, status: "FAIL" });
        }
      } catch (error) {
        log.error(`${testCase.name}: Error - ${error.message}`);
        results.push({ test: testCase.name, status: "ERROR" });
      }
    }

    return results;
  } catch (error) {
    log.error(`Login test setup failed: ${error.message}`);
    return [];
  }
};

// Test security features
const testSecurityFeatures = async () => {
  log.subsection("Testing Security Features");

  const results = [];

  // Test 1: Check for proper HTTP headers
  try {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await makeRequest(options, {
      email: "test@example.com",
      password: "password",
    });

    // Check security headers
    const securityHeaders = [
      "x-powered-by", // Should be removed/hidden
      "x-frame-options",
      "x-content-type-options",
      "strict-transport-security",
    ];

    let securityScore = 0;

    if (!response.headers["x-powered-by"]) {
      log.success("X-Powered-By header is properly hidden");
      securityScore++;
    } else {
      log.warning("X-Powered-By header is exposed");
    }

    if (response.headers["x-frame-options"]) {
      log.success("X-Frame-Options header is set");
      securityScore++;
    } else {
      log.warning("X-Frame-Options header is missing");
    }

    if (response.headers["x-content-type-options"]) {
      log.success("X-Content-Type-Options header is set");
      securityScore++;
    } else {
      log.warning("X-Content-Type-Options header is missing");
    }

    results.push({
      test: "Security Headers",
      status: securityScore > 1 ? "PASS" : "PARTIAL",
      score: `${securityScore}/3`,
    });
  } catch (error) {
    log.error(`Security headers test failed: ${error.message}`);
    results.push({ test: "Security Headers", status: "ERROR" });
  }

  return results;
};

// Main test runner
const runTests = async () => {
  log.section("AUTHENTICATION SYSTEM EVALUATION");
  log.info("Testing backend authentication API...");

  // Check if server is running
  const serverRunning = await testServerHealth();
  if (!serverRunning) {
    log.error(
      "Backend server is not running. Please start it with: npm run dev"
    );
    return;
  }

  // Run tests
  const registrationResults = await testRegistration();
  const loginResults = await testLogin();
  const securityResults = await testSecurityFeatures();

  // Summary
  log.section("TEST SUMMARY");

  const allResults = [
    ...registrationResults,
    ...loginResults,
    ...securityResults,
  ];

  const passed = allResults.filter((r) => r.status === "PASS").length;
  const failed = allResults.filter((r) => r.status === "FAIL").length;
  const errors = allResults.filter((r) => r.status === "ERROR").length;
  const partial = allResults.filter((r) => r.status === "PARTIAL").length;

  log.info(`Total Tests: ${allResults.length}`);
  log.success(`Passed: ${passed}`);
  if (partial > 0) log.warning(`Partial: ${partial}`);
  if (failed > 0) log.error(`Failed: ${failed}`);
  if (errors > 0) log.error(`Errors: ${errors}`);

  // Recommendations
  log.section("RECOMMENDATIONS");

  if (failed > 0 || errors > 0) {
    log.warning("⚠️  Authentication system needs improvements:");
    log.info("1. Fix failing test cases");
    log.info("2. Improve error handling");
    log.info("3. Add input validation");
  }

  if (partial > 0) {
    log.warning("🔧 Security enhancements needed:");
    log.info("1. Add security headers middleware");
    log.info("2. Implement rate limiting");
    log.info("3. Add CORS configuration");
  }

  const successRate = (passed / allResults.length) * 100;

  if (successRate >= 90) {
    log.success("🎉 Authentication system is at industry standard!");
  } else if (successRate >= 70) {
    log.warning("📈 Authentication system is good but can be improved");
  } else {
    log.error("🚨 Authentication system needs significant improvements");
  }

  log.info(`\nOverall Success Rate: ${successRate.toFixed(1)}%`);
};

// Run the tests
runTests().catch((error) => {
  log.error(`Test runner failed: ${error.message}`);
  process.exit(1);
});
