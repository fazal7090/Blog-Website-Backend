import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  addPost,
  deletePostsByUser,
  updatePost,
  getPost,
  deletePostById
} from '../controllers/postcontroller.js';

const router = express.Router();

// Middleware to handle validation errors
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Add a post (title, content required)
router.post(
  '/add',
  [
    body('title').notEmpty().withMessage('title is required'),
    body('content').notEmpty().withMessage('content is required')
  ],
  handleValidation,
  addPost
);

// Delete all posts for a user (no userId in body, uses req.user.id)
router.delete(
  '/delete_all',
  handleValidation,
  deletePostsByUser
);

// Update a post (postId in URL, title and content required in body)
router.put(
  '/update/:postId',
  [
    param('postId').notEmpty().withMessage('postId is required'),
    body('title').notEmpty().withMessage('title is required'),
    body('content').notEmpty().withMessage('content is required'),
    body('userId').notEmpty().withMessage('User ID is required')
  ],
  handleValidation,
  updatePost
);

// Get a post (postId in URL required)
router.get(
  '/get/:postId',
  [param('postId').notEmpty().withMessage('postId is required')],
  handleValidation,
  getPost
);

// Delete a specific post by postId (ownership check)
router.delete(
  '/delete/singlepost/:postId',
  [param('postId').notEmpty().withMessage('postId is required')],
  handleValidation,
  deletePostById
);

export default router; 