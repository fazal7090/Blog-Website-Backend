import db from './db.js';
import express from 'express';
const app = express();
const port = 8080;

//bcrypt for hashing
import bcrypt from 'bcrypt';



// express validator to check in coming data
import { body, validationResult } from 'express-validator';

app.use(express.json());

// sign up route
app.post('/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be male, female, or other'),
  body('city').notEmpty().withMessage('City is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, age, gender, city, country, address, email, password: plainPassword } = req.body;

  try {
    // Check if user already exists
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.status(409);
      return res.json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Insert new user with all fields
    await db.query(
      'INSERT INTO users (name, age, gender, city, country, address, email, hashedpassword) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [name, age, gender, city, country, address, email, hashedPassword]
    );

    res.json({
      message: "User created successfully",
      user: { name, age, gender, city, country, address, email }
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
    const isPasswordValid = await bcrypt.compare(plainPassword, user.hashedpassword);

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

// profile update (PUT, no password change here)
app.put('/user_update', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  body('city').optional().notEmpty().withMessage('City cannot be empty'),
  body('country').optional().notEmpty().withMessage('Country cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, name, age, city, country, address } = req.body;

  // 1. Check if user exists
  const userResult = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  // 2. Build update fields/values as before
  const fields = [];
  const values = [];
  let idx = 2;

  if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
  if (age !== undefined) { fields.push(`age = $${idx++}`); values.push(age); }
  if (city !== undefined) { fields.push(`city = $${idx++}`); values.push(city); }
  if (country !== undefined) { fields.push(`country = $${idx++}`); values.push(country); }
  if (address !== undefined) { fields.push(`address = $${idx++}`); values.push(address); }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  // 3. Run the update
  const query = `UPDATE users SET ${fields.join(', ')} WHERE email = $1 RETURNING *`;
  const result = await db.query(query, [email, ...values]);
  const { hashedpassword, ...userWithoutPassword } = result.rows[0];
  res.json({ message: "Profile updated", user: userWithoutPassword });
});

// delete user route
app.delete('/user_delete', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 1. Find user
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = result.rows[0];

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.hashedpassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 3. Delete user
    await db.query('DELETE FROM users WHERE email = $1', [email]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// get user by email (excluding password)
app.get('/user/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const { hashedpassword, ...userWithoutPassword } = result.rows[0];
    res.json({ user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
