import request from 'supertest';
import app from '../src/index.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('POST /posts/add (Post Creation)', () => {
  let authToken;
  let testUser;

  // Setup: Create a user and log in to get a token before running tests
  beforeAll(async () => {
    // 1. Hash the password
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 2. Create a unique user with the hashed password
    const uniqueEmail = `post-test-user-${Date.now()}@example.com`;
    testUser = await prisma.users.create({
      data: {
        name: 'Post Test User',
        email: uniqueEmail,
        hashedpassword: hashedPassword, // Use the correct field name 'hashedpassword'
        age: 30,
        gender: 'Male',
        city: 'Testville',
        country: 'Testland',
        address: '123 Test St',
      },
    });

    // 3. Log in using the plain-text password
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: testUser.email,
        password: plainPassword, // Use the plain-text password for login
      });

    authToken = loginResponse.body.token;
    authmsg   = loginResponse.body.message;

    console.log(authToken);
    console.log(authmsg);

    

  });

  // Teardown: Clean up created user and posts after tests are done
  // afterAll(async () => {
  //   // Find posts created by the test user to avoid foreign key errors
  //   const posts = await prisma.post.findMany({ where: { userId: testUser.id } });
  //   if (posts.length > 0) {
  //     await prisma.post.deleteMany({ where: { userId: testUser.id } });
  //   }
  //   // Delete the test user
  //   await prisma.users.delete({ where: { id: testUser.id } });
  //   await prisma.$disconnect();
  // });

  // Test Case 1: The "Happy Path" for successful post creation
  it('should create a new post and return 201 when given valid data and a token', async () => {
    const response = await request(app)
      .post('/posts/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'My First Awesome Post',
        content: 'This is the detailed content of the awesome post.',
      });

       console.log('POST /posts/add response:', response.body); 

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Post created successfully');
    expect(response.body.data).toHaveProperty('title', 'My First Awesome Post');

    // Verify the post was actually created in the database for the correct user
    const createdPost = await prisma.post.findFirst({
      where: {
        title: 'My First Awesome Post',
        userId: testUser.id,
      },
    });
    expect(createdPost).toBeDefined();
    expect(createdPost.userId).toBe(testUser.id);
  });

  // Test Case 2: Missing title field
  it('should return a 400 error if the title is missing', async () => {
    const response = await request(app)
      .post('/posts/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'This post has no title.',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    const hasTitleError = response.body.errors.some(
      (error) => error.path === 'title' && error.msg === 'title is required'
    );
    expect(hasTitleError).toBe(true);
  });

  // Test Case 3: Missing content field
  it('should return a 400 error if the content is missing', async () => {
    const response = await request(app)
      .post('/posts/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'This post has no content.',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    const hasContentError = response.body.errors.some(
      (error) => error.path === 'content' && error.msg === 'content is required'
    );
    expect(hasContentError).toBe(true);
  });

  // Test Case 4: Unauthorized request (no token)
  it('should return a 401 error if no authentication token is provided', async () => {
    const response = await request(app)
      .post('/posts/add')
      .send({
        title: 'An unauthorized post',
        content: 'This should not be created.',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Authorization header missing or malformed');
  });

  // Test Case 5: Invalid token
  it('should return a 401 error if the authentication token is invalid', async () => {
    const response = await request(app)
      .post('/posts/add')
      .set('Authorization', 'Bearer an-invalid-token-string')
      .send({
        title: 'A post with a bad token',
        content: 'This should also not be created.',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Invalid or expired token');
  });
});

  