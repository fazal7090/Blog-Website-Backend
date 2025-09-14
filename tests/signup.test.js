import request from 'supertest';
import app from '../src/index.js'; // Make sure your app is correctly exported from src/index.js



// This block describes the entire suite of tests for the POST /signup endpoint
describe('POST /signup endpoint', () => {

  // Test Case 1: The "Happy Path" for a successful signup
  it('should create a new user and return 201 when given valid data', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: 'Successful User',
        email: `success_${Date.now()}@example.com`, // Use a unique email to ensure the test is repeatable
        password: 'password123',
        age: 30,
        gender: 'Female',
        city: 'Testville',
        country: 'Testland',
        address: '123 Success Street'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.data).toHaveProperty('email');
  });

  // Test Case 2: Checking for a conflict when the email already exists
  it('should return a 409 conflict error if the email already exists', async () => {
    const email = `duplicate_${Date.now()}@example.com`;
    const userData = {
      name: 'Duplicate User',
      email: email,
      password: 'password123',
      age: 25,
      gender: 'Male',
      city: 'Testville',
      country: 'Testland',
      address: '456 Duplicate Lane'
    };

    // First, successfully create the user
    await request(app).post('/signup').send(userData);

    // Then, attempt to create the same user again
    const response = await request(app).post('/signup').send(userData);

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('User already exists');
  });


  // Test Case 3: Parameterized tests for all required fields
  describe('validation for required fields', () => {
    const validUserData = {
      name: 'Test User',
      email: 'will_be_replaced@example.com',
      password: 'password123',
      age: 30,
      gender: 'Female',
      city: 'Testville',
      country: 'Testland',
      address: '123 Test Street'
    };

    // This table defines each test case.
    // [field to remove, expected 'path' in the error message]
    const requiredFields = [
      ['name', 'name'],
      ['email', 'email'],
      ['password', 'password'],
      ['city', 'city'],
      ['country', 'country'],
      ['address', 'address'],
      ['age', 'age'],
      ['gender', 'gender'],
    ];

    // Jest's it.each will loop through the 'requiredFields' array and run a test for each row.
    // The '%s' in the test name is a placeholder that gets filled by the first item in the row array.
    it.each(requiredFields)(
      'should return a 400 error if the %s field is missing',
      async (fieldToRemove, expectedErrorPath) => {
        // 1. Create a copy of the valid data to modify for this specific test run.
        const incompleteData = { ...validUserData };

        // 2. Ensure the email is unique for this specific test run to avoid accidental 409 errors.
        incompleteData.email = `incomplete_${fieldToRemove}_${Date.now()}@example.com`;

        // 3. Remove the one field we are testing for.
        delete incompleteData[fieldToRemove];

        // 4. Send the request with the incomplete data.
        const response = await request(app)
          .post('/signup')
          .send(incompleteData);

        // 5. Assert that the server responded correctly.
        expect(response.statusCode).toBe(400); // Expect a Bad Request status
        expect(response.body).toHaveProperty('errors'); // Expect the body to contain an 'errors' array

        // 6. Check that the 'errors' array contains an error for our specific missing field.
        const hasSpecificError = response.body.errors.some(
          (error) => error.path === expectedErrorPath
        );
        expect(hasSpecificError).toBe(true);
      }
    );
  });
}); 