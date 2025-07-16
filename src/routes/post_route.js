import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  addPost,
  deletePostsByUser,
  updatePost,
  getPost,
  deletePostById,
  getallPosts
} from '../controllers/postcontroller.js';
import {  handleValidation } from '../middleware/errorMiddleware.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();



// Add a post (title, content required)
router.post(
  '/add',
  authMiddleware,
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
  authMiddleware,
  handleValidation,
  deletePostsByUser
);

// Update a post (postId in URL, title and content required in body)
router.put(
  '/update/:postId',
  authMiddleware,
  [
    param('postId').notEmpty().withMessage('postId is required'),
    body('title').notEmpty().withMessage('title is required'),
    body('content').notEmpty().withMessage('content is required')
  ],
  handleValidation,
  updatePost
);

// Get all posts of a specific user 
router.get(
  '/getallposts',
  authMiddleware,
  getallPosts
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
  authMiddleware,
  [param('postId').notEmpty().withMessage('postId is required')],
  handleValidation,
  deletePostById
);

export default router; 