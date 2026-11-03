const request = require("supertest");
const app = require("./app");
const { pool } = require("./db");

jest.mock("./db", () => ({
  pool: { query: jest.fn() },
}));

afterEach(() => {
  jest.clearAllMocks();
});

test("GET /menu returns menu items", async () => {
  pool.query.mockResolvedValueOnce([
    [{ id: 1, name: "ข้าวผัด", price: 60 }],
    [],
  ]);

  const response = await request(app).get("/menu");

  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1);
  expect(response.body[0].name).toBe("ข้าวผัด");
});

test("GET /menu returns 500 when the database fails", async () => {
  pool.query.mockRejectedValueOnce(new Error("database details"));

  const response = await request(app).get("/menu");

  expect(response.status).toBe(500);
  expect(response.body.error).toBeDefined();
  expect(JSON.stringify(response.body)).not.toContain("database details");
});

test("POST /orders rejects a blank name without querying MySQL", async () => {
  const response = await request(app)
    .post("/orders")
    .send({ customer_name: "   " });

  expect(response.status).toBe(400);
  expect(response.body.error).toBeDefined();
  expect(pool.query).not.toHaveBeenCalled();
});

test("POST /orders rejects a name longer than 100 characters", async () => {
  const response = await request(app)
    .post("/orders")
    .send({ customer_name: "x".repeat(101) });

  expect(response.status).toBe(400);
  expect(pool.query).not.toHaveBeenCalled();
});

test("POST /orders creates an order", async () => {
  pool.query.mockResolvedValueOnce([{ insertId: 12 }, []]);

  const response = await request(app)
    .post("/orders")
    .send({ customer_name: "Mali" });

  expect(response.status).toBe(201);
  expect(response.body.id).toBe(12);
  expect(response.body.status).toBe("pending");
});
