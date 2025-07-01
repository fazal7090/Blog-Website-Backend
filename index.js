const db = require('./db');
const express = require('express');
const app = express();
const port = 8080;
const bcrypt = require('bcrypt');
// Middleware to parse JSON
app.use(express.json());



app.post('/signup', async (req, res) => {
  const email = req.body.email;
  const password =await bcrypt.hash(req.body.password,10);
  const name = req.body.name;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.send("User already exists");
    }

    await db.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3)', [email, password, name]);
    res.send("User created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10); 

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.send("User does not exist");
    }
    
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    
    if (!isPasswordValid) {
      return res.send("Invalid password");
    }
    
    res.send("Login successful");
  
    
    }
   catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
