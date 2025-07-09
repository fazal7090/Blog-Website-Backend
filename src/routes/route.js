import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  signup,
  login,
  updateUser,
  patchUser,
  deleteUser,
  getUser
} from '../controllers/usercontroller.js';

const router = express.Router();

// Validation error handler middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Signup route with validation
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be male, female, or other'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidation
  ],
  signup
);

// Login route with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation
  ],
  login
);

// PUT update user (full update, all fields required except password)
router.put(
  '/user_update',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be male, female, or other'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('address').notEmpty().withMessage('Address is required'),
    handleValidation
  ],
  updateUser
);

// PATCH update user (partial update, all fields optional except email)
router.patch(
  '/user_update',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Gender must be male, female, or other'),
    body('city').optional().notEmpty().withMessage('City cannot be empty'),
    body('country').optional().notEmpty().withMessage('Country cannot be empty'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    handleValidation
  ],
  patchUser
);

// Delete user route with validation
router.delete(
  '/user_delete',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation
  ],
  deleteUser
);

// Get user by email (no validation needed)
router.get('/user/:email', getUser);

export default router;
