const db = require('./db');
const express = require('express');
const app = express();
const port = 8080;
const bcrypt = require('bcrypt');


app.use(express.json());


app.post('/signup', async (req, res) => {
  const email = req.body.email;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.status(409);
      return res.json({ message: "User already exists" });
    }

    const password = await bcrypt.hash(req.body.password, 10);
    const name = req.body.name;

    await db.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3)', [email, password, name]);

   
    res.json({
      message: "User created successfully",
      user: { email, name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(404);
      return res.json({ message: "User does not exist" });
      
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

    if (!isPasswordValid) {
      res.status(401);
      return res.json({ message: "Invalid password" });
    }

   
    const { password, ...userWithoutPassword } = user;
    res.json({
      message: "Login successful",
      user: { email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
