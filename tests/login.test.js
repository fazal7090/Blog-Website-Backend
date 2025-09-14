import request from 'supertest';
import app from '../src/index.js';

const testUser = {
  email: 'f@xample.com',
  password: 'securePassword123',
};

describe('POST /login endpoint', () => {

  // Test Case 1: The "Happy Path" for a successful login
  it('should log in a user and return 200 when given valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: testUser.email, 
        password: testUser.password 
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.data).toHaveProperty('email');
  });

  // Test Case 2: Incorrect email
  it('should return 401 if the email is incorrect', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'wrong_' + testUser.email, // incorrect email
        password: testUser.password // correct password
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('User does not exist');
  });

  // Test Case 3: Incorrect password
  it('should return 401 if the password is incorrect', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: testUser.email, // correct email
        password: 'wrongpassword' // incorrect password
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid password');
  });

  
});