# Blog Website Backend

A comprehensive RESTful API backend for a blog website built with Node.js, Express.js, and PostgreSQL. This application provides user authentication, blog post management, and admin functionality with role-based access control.

## 🚀 Features

### User Management
- **User Registration**: Create new user accounts with comprehensive profile information
- **User Authentication**: Secure login with JWT token-based authentication
- **Profile Management**: Update user profiles with PUT/PATCH operations
- **Account Deletion**: Secure account deletion with password verification
- **Role-based Access**: Support for both regular users and admin users

### Blog Post Management
- **Create Posts**: Authenticated users can create blog posts
- **Read Posts**: Public access to individual posts and user-specific post collections
- **Update Posts**: Users can update their own posts
- **Delete Posts**: Users can delete their own posts or all their posts
- **Post Ownership**: Automatic ownership verification for post operations

### Admin Features
- **User Management**: Admins can soft-delete and restore user accounts
- **Post Oversight**: Admins can view, update, and delete any user's posts
- **Global Post Access**: Admins can view all posts from all users
- **Admin Protection**: Admins cannot delete other admin accounts

### Security Features
- **Password Hashing**: Secure password storage using bcrypt
- **JWT Authentication**: Token-based authentication with configurable secrets
- **Input Validation**: Comprehensive request validation using express-validator
- **Security Headers**: Helmet.js for security headers
- **Authorization Middleware**: Role-based access control

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: Helmet.js
- **Testing**: Jest with Supertest
- **Development**: Nodemon for hot reloading

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/fazal7090/Blog-Website-Backend.git>
   cd blog-website-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=8080
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate deploy
   
   # Seed the database with admin user (optional)
   node prisma/seed.js
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:8080` (or the port specified in your `.env` file).

### Production Mode
```bash
node src/index.js
```

### Running Tests
```bash
npm test
```

## 📚 API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### User Endpoints

#### Register User
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "gender": "Male",
  "city": "New York",
  "country": "USA",
  "address": "123 Main St"
}
```

#### Login User
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Details
```http
GET /user/details
Authorization: Bearer <token>
```

#### Update User Profile (Full Update)
```http
PUT /user_update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "age": 26,
  "gender": "Male",
  "city": "Boston",
  "country": "USA",
  "address": "456 Oak Ave"
}
```

#### Update User Profile (Partial Update)
```http
PATCH /user_update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "city": "Boston"
}
```

#### Delete User Account
```http
DELETE /user_delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Post Endpoints

#### Create Post
```http
POST /posts/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post..."
}
```

#### Get All User Posts
```http
GET /posts/getallposts
Authorization: Bearer <token>
```

#### Get Specific Post
```http
GET /posts/get/:postId
```

#### Update Post
```http
PUT /posts/update/:postId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Post Title",
  "content": "Updated post content..."
}
```

#### Delete Specific Post
```http
DELETE /posts/delete/singlepost/:postId
Authorization: Bearer <token>
```

#### Delete All User Posts
```http
DELETE /posts/delete_all
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Posts (Admin Only)
```http
GET /admin/users/allposts
Authorization: Bearer <admin-token>
```

#### Get Posts by User (Admin Only)
```http
GET /admin/users/allposts/:userId
Authorization: Bearer <admin-token>
```

#### Delete User Post (Admin Only)
```http
DELETE /admin/user/:userId/post/:postId
Authorization: Bearer <admin-token>
```

#### Update User Post (Admin Only)
```http
PUT /admin/user/:userId/post/:postId
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Admin Updated Title",
  "content": "Admin updated content..."
}
```

#### Delete User Account (Admin Only)
```http
DELETE /admin/user_delete
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": 123
}
```

#### Restore User Account (Admin Only)
```http
PUT /admin/user_undo_delete
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": 123
}
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "age" INTEGER,
    "gender" VARCHAR(10),
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "address" TEXT,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "hashedpassword" TEXT NOT NULL,
    "role" TEXT DEFAULT 'user',
    "isDeleted" BOOLEAN DEFAULT false
);
```

### Posts Table
```sql
CREATE TABLE "post" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER REFERENCES "users"("id")
);
```

## 🧪 Testing

The application includes comprehensive test suites:

- **User Registration Tests**: Validates signup functionality and input validation
- **User Login Tests**: Tests authentication flow and error handling
- **Post Creation Tests**: Validates post creation with authentication

Run tests with:
```bash
npm test
```

## 🔒 Security Considerations

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens are used for stateless authentication
- Input validation prevents malicious data injection
- Helmet.js provides security headers
- Role-based access control prevents unauthorized operations
- Soft deletion for users (admin feature) maintains data integrity

## 📁 Project Structure

```
src/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── usercontroller.js     # User-related business logic
│   ├── postcontroller.js     # Post-related business logic
│   ├── admin_user_controller.js  # Admin user management
│   └── admin_post_controller.js  # Admin post management
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── adminMiddleware.js    # Admin role verification
│   ├── userMiddleware.js     # Token generation
│   └── errorMiddleware.js    # Validation error handling
├── routes/
│   ├── user_route.js         # User endpoints
│   ├── post_route.js         # Post endpoints
│   ├── admin_user_route.js   # Admin user endpoints
│   └── admin_post_route.js   # Admin post endpoints
├── generated/                # Prisma generated files
└── index.js                  # Application entry point

tests/
├── signup.test.js           # User registration tests
├── login.test.js            # Authentication tests
└── post_creation.test.js    # Post creation tests

prisma/
├── schema.prisma            # Database schema
├── migrations/              # Database migrations
└── seed.js                  # Database seeding
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Database connection credentials are hardcoded in `src/config/db.js` (should use environment variables)
- Some test cleanup is commented out in `post_creation.test.js`

## 🔮 Future Enhancements

- Add file upload functionality for post images
- Implement post categories and tags
- Add comment system for posts
- Implement post search functionality
- Add rate limiting for API endpoints
- Implement email verification for user registration
- Add post likes/dislikes functionality
- Implement post drafts and publishing workflow


**Note**: Make sure to update the database connection string and JWT secret in your `.env` file before running the application.
**Note**: This is backend project only you will need to implement frontend separately
