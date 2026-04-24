const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Yuva@2005reddy', // 🔥 put your MySQL password
    database: 'veltech_student_db'
});

db.connect(err => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// Insert route
app.post('/register', (req, res) => {
    const { name, email, dob, department, phone } = req.body;

    const sql = `INSERT INTO students (name, email, dob, department, phone)
                 VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [name, email, dob, department, phone], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error inserting data");
        } else {
            res.send("Student Registered Successfully! <br><a href='/'>Go Back</a>");
        }
    });
});

// Fetch students
app.get('/students', (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) {
            res.send("Error fetching data");
        } else {
            let output = "<h2>Registered Students</h2><ul>";
            results.forEach(student => {
                output += `<li>${student.name} - ${student.department}</li>`;
            });
            output += "</ul><a href='/'>Go Back</a>";
            res.send(output);
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
