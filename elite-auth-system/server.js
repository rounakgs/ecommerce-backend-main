const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

// ✅ PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eliteusers",
  password: "1234",
  port: 5432,
});

// ================================
// ✅ LOGIN API
// ================================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================================
// ✅ SIGNUP API
// ================================
app.post("/signup", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (fname, lname, email, password) VALUES ($1, $2, $3, $4)",
      [fname, lname, email, password]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// ================================
// ✅ GET PRODUCTS API
// ================================
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// ================================
// ✅ ADD TO CART API
// ================================
app.post("/add-to-cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const check = await pool.query(
      "SELECT * FROM carts WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    if (check.rows.length > 0) {
      await pool.query(
        "UPDATE carts SET quantity = quantity + $1 WHERE user_id=$2 AND product_id=$3",
        [quantity, userId, productId]
      );
    } else {
      await pool.query(
        "INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [userId, productId, quantity]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// ================================
// ✅ GET CART API
// ================================
app.get("/get-cart/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query(
      `SELECT c.quantity, p.*
       FROM carts c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ================================
// ✅ REMOVE FROM CART API
// ================================
app.post("/remove-from-cart", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await pool.query(
      "DELETE FROM carts WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );
    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================================
// ✅ UPDATE CART QUANTITY API
// ================================
app.post("/update-cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    if (quantity > 0) {
      await pool.query(
        "UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, userId, productId]
      );
      res.json({ success: true, message: "Cart updated" });
    } else {
      await pool.query(
        "DELETE FROM carts WHERE user_id = $1 AND product_id = $2",
        [userId, productId]
      );
      res.json({ success: true, message: "Item removed because quantity was zero" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================================
// ✅ CHECKOUT API
// ================================
app.post("/checkout", async (req, res) => {
  const { userId, fullname, email, mobile, address, city, state, pincode } = req.body;

  try {
    await pool.query(
      "INSERT INTO orders (user_id, fullname, email, mobile, address, city, state, pincode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [userId, fullname, email, mobile, address, city, state, pincode]
    );

    await pool.query("DELETE FROM carts WHERE user_id = $1", [userId]);

    res.json({ success: true, message: "Order placed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================================
// ✅ SERVER START
// ================================
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
