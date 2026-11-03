const express = require("express");
const { pool } = require("./db");

const app = express();
app.use(express.json());

app.get("/menu", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, price FROM menu_items WHERE available = TRUE ORDER BY price ASC"
    );
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบ" });
  }
});

app.post("/orders", async (req, res) => {
  const customerName = req.body?.customer_name;

  if (
    typeof customerName !== "string" ||
    customerName.trim() === "" ||
    customerName.trim().length > 100
  ) {
    return res.status(400).json({ error: "customer_name ไม่ถูกต้อง" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO orders (customer_name) VALUES (?)",
      [customerName.trim()]
    );
    return res.status(201).json({
      id: result.insertId,
      customer_name: customerName.trim(),
      status: "pending",
    });
  } catch (err) {
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบ" });
  }
});

module.exports = app;
