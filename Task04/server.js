const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ===========================
   MySQL Connection
=========================== */
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Yuva@2005reddy",  // your mysql password
    database: "order_management"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

/* ===========================
   ROUTES
=========================== */

/* Test Route */
app.get("/", (req, res) => {
    res.send("Order Management API Running");
});

/* Get Order History (JOIN) */
app.get("/orders", (req, res) => {

    const query = `
        SELECT 
            c.name AS customer_name,
            p.product_name,
            p.price,
            o.quantity,
            (p.price * o.quantity) AS total_amount,
            o.order_date
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON o.product_id = p.product_id
        ORDER BY o.order_date DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/* Most Active Customer */
app.get("/most-active", (req, res) => {

    const query = `
        SELECT c.name, COUNT(o.order_id) AS total_orders
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        GROUP BY c.customer_id
        ORDER BY total_orders DESC
        LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/* Highest Value Order */
app.get("/highest-order", (req, res) => {

    const query = `
        SELECT 
            c.name,
            (p.price * o.quantity) AS total_amount
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON o.product_id = p.product_id
        ORDER BY total_amount DESC
        LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/* ===========================
   Start Server
=========================== */
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});