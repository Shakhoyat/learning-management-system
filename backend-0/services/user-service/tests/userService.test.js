const request = require("supertest");
const app = require("../server");

describe("User Service Health Check", () => {
  test("GET /health should return service status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("service", "user-service");
    expect(response.body).toHaveProperty("version", "1.0.0");
  });
});

describe("User API Endpoints", () => {
  describe("Public endpoints", () => {
    test("GET /api/users/public/stats should return public statistics", async () => {
      const response = await request(app)
        .get("/api/users/public/stats")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("stats");
    });

    test("GET /api/users/public/teachers should return public teachers list", async () => {
      const response = await request(app)
        .get("/api/users/public/teachers")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("Protected endpoints", () => {
    test("GET /api/users/me should require authentication", async () => {
      const response = await request(app).get("/api/users/me").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("GET /api/users/profile should require authentication", async () => {
      const response = await request(app).get("/api/users/profile").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});

describe("Error handling", () => {
  test("404 for non-existent routes", async () => {
    const response = await request(app)
      .get("/api/users/non-existent-route")
      .expect(404);

    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("error");
  });
});
