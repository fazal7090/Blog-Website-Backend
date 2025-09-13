import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// Admin: Delete user by userId
export const adminDeleteUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    if (user.isDeleted) {
      return res.status(400).json({ message: "User already deleted", data: null });
    }
    if (user.role=== 'admin') {
      return res.status(403).json({ message: "Cannot delete admin user", data: null });
    }
    await prisma.users.update({
  where: { id: userId },
  data: { isDeleted: true }
});

    const { hashedpassword,isDeleted, ...userWithoutPassword } = user;
    res.json({ message: "User deleted successfully", data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Admin: Undo delete user by userId
export const adminUndoDeleteUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    if (!user.isDeleted) {
      return res.status(400).json({ message: "User is an active user already", data: null });
    }
    await prisma.users.update({
      where: { id: userId },
      data: { isDeleted: false }
    });
    const { hashedpassword, isDeleted, ...userWithoutPassword } = user;
    // Return the user data without the password
    res.json({ message: "User restored successfully", data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}



