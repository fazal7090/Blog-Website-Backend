import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const signup = async (req, res) => {
  const { name, age, gender, city, country, address, email, password: plainPassword } = req.body;
  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409);
      return res.json({ message: "User already exists", data: null });
    }
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await prisma.users.create({
      data: {
        name,
        age,
        gender,
        city,
        country,
        address,
        email,
        hashedpassword: hashedPassword,
      },
    });
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
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      res.status(404);
      return res.json({ message: "User does not exist", data: null });
    }
    const isPasswordValid = await bcrypt.compare(plainPassword, user.hashedpassword);
    if (!isPasswordValid) {
      res.status(401);
      return res.json({ message: "Invalid password", data: null });
    }
    const { hashedpassword, ...userWithoutPassword } = user;
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
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    const updatedUser = await prisma.users.update({
      where: { email },
      data: { name, age, gender, city, country, address },
    });
    const { hashedpassword, ...userWithoutPassword } = updatedUser;
    res.json({ message: "Profile fully replaced", data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const patchUser = async (req, res) => {
  const { email, ...fieldsToUpdate } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    const updatedUser = await prisma.users.update({
      where: { email },
      data: fieldsToUpdate,
    });
    const { hashedpassword, ...userWithoutPassword } = updatedUser;
    res.json({ message: "Profile updated", data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const deleteUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    const isPasswordValid = await bcrypt.compare(password, user.hashedpassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password", data: null });
    }
    await prisma.users.delete({ where: { email } });
    res.json({ message: "User deleted successfully", data: null });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const getUser = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    const { hashedpassword, ...userWithoutPassword } = user;
    res.json({ message: "User found", data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};



// 2. Reusability
// Same controller function can be used by multiple routes
// Routes can be easily reorganized without touching business logic
// 3. Testability
// You can test business logic (controllers) independently of routing
// You can test routing logic separately from business logic
























