import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
  const { name, age, gender, city, country, address, email, password: plainPassword } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.status(409);
      return res.json({ message: "User already exists", data: [] });
    }
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await db.query(
      'INSERT INTO users (name, age, gender, city, country, address, email, hashedpassword) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [name, age, gender, city, country, address, email, hashedPassword]
    );
    res.status(201).json({
      message: "User created successfully",
      data: { name, age, gender, city, country, address, email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const login = async (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(404);
      return res.json({ message: "User does not exist", data: [] });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(plainPassword, user.hashedpassword);
    if (!isPasswordValid) {
      res.status(401);
      return res.json({ message: "Invalid password", data: [] });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({
      message: "Login successful",
      data: { email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const updateUser = async (req, res) => {
  const { email, name, age, gender, city, country, address } = req.body;
  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "User not found", data: [] });
  }
  const result = await db.query(
    'UPDATE users SET name = $1, age = $2, gender = $3, city = $4, country = $5, address = $6 WHERE email = $7 RETURNING *',
    [name, age, gender, city, country, address, email]
  );
  const { hashedpassword, ...userWithoutPassword } = result.rows[0];
  res.json({ message: "Profile fully replaced", data: userWithoutPassword });
};

export const patchUser = async (req, res) => {
  const { email, name, age, gender, city, country, address } = req.body;
  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "User not found", data: [] });
  }
  const user = userResult.rows[0];
  const updatedUser = {
    name: name !== undefined ? name : user.name,
    age: age !== undefined ? age : user.age,
    gender: gender !== undefined ? gender : user.gender,
    city: city !== undefined ? city : user.city,
    country: country !== undefined ? country : user.country,
    address: address !== undefined ? address : user.address,
    email: user.email
  };
  const result = await db.query(
    'UPDATE users SET name = $1, age = $2, gender = $3, city = $4, country = $5, address = $6 WHERE email = $7 RETURNING *',
    [updatedUser.name, updatedUser.age, updatedUser.gender, updatedUser.city, updatedUser.country, updatedUser.address, updatedUser.email]
  );
  const { hashedpassword, ...userWithoutPassword } = result.rows[0];
  res.json({ message: "Profile updated", data: userWithoutPassword });
};

export const deleteUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found", data: [] });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.hashedpassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password", data: [] });
    }
    await db.query('DELETE FROM users WHERE email = $1', [email]);
    res.json({ message: "User deleted successfully", data: [] });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const getUser = async (req, res) => {
  const email = req.params.email;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found", data: [] });
    }
    const { hashedpassword, ...userWithoutPassword } = result.rows[0];
    res.json({ message: "User found", data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};




























