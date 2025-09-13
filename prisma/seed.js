import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();



async function createAdminUser() {
  const plainPassword = '123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // salt rounds = 10

  const admin = await prisma.users.create({
    data: {
      name: 'Admin User',
      age: 30,
      gender: 'Female',
      city: 'Lahore',
      country: 'Pakistan',
      address: '123 Admin Street',
      email: 'admin@1.com',
      hashedpassword: hashedPassword,
      role: 'admin'
    }
  });

  console.log('Admin user created:', admin);
}

createAdminUser()
  .catch(err => console.error(err))
    .finally(() => {
    prisma.$disconnect();
  });

  
