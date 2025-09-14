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

import {
  getAllPosts,
  adminDeletePost,
  adminUpdatePost
} from '../controllers/admin_post_controller.js';

import {  handleValidation } from '../middleware/errorMiddleware.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';    

const router = express.Router();

// Admin Adds His Posts 
router.post(
  '/posts/add',
  authMiddleware,
  requireAdmin,
  [
    body('title').notEmpty().withMessage('title is required'),
    body('content').notEmpty().withMessage('content is required')
  ],
  handleValidation,
  addPost
);

// Admin Deletes His Posts 
router.delete(
  '/posts/delete_all',
  authMiddleware,
    requireAdmin,
  handleValidation,
  deletePostsByUser
);

// Admin Updates His Posts
router.put(
  '/posts/update/:postId',
  authMiddleware,
  requireAdmin,
  [
    param('postId').notEmpty().withMessage('postId is required'),
    body('title').notEmpty().withMessage('title is required'),
    body('content').notEmpty().withMessage('content is required')
  ],
  handleValidation,
  updatePost
);

// Admin Gets a specific post by postId
router.get(
  '/post/get/:postId',
  [param('postId').notEmpty().withMessage('postId is required')],
  handleValidation,
  getPost
);

// Admin Delete a specific post by postId 
router.delete(
  '/post/delete/singlepost/:postId',
  authMiddleware,
    requireAdmin,
  [param('postId').notEmpty().withMessage('postId is required')],
  handleValidation,
  deletePostById
);


// ROUTES OF ADMIN THAT PERFORM CRUD OPERATIONS ON POSTS OF USERS

// Admin: Get all posts of all users
router.get(
  '/users/allposts',
  authMiddleware,
  requireAdmin,
  getAllPosts
);

// Admin: Get all posts of a specific user
router.get(
  '/users/allposts/:userId',
  authMiddleware,
  requireAdmin,
  [param('userId').notEmpty().withMessage('userId is required')],
  handleValidation,
  getallPosts
);

// Admin: Delete a specific post of a user
router.delete(
  '/user/:userId/post/:postId',
  authMiddleware,
  requireAdmin,
  [
    param('userId').notEmpty().withMessage('userId is required'),
    param('postId').notEmpty().withMessage('postId is required')
  ],
  handleValidation,
  adminDeletePost
);

// Admin: Update a specific post of a user
router.put(
  '/user/:userId/post/:postId',
  authMiddleware,
  requireAdmin,
  [
    param('userId').notEmpty().withMessage('userId is required'),
    param('postId').notEmpty().withMessage('postId is required'),
    body('title').notEmpty().withMessage('title is required'),
    body('content').notEmpty().withMessage('content is required')
  ],
  handleValidation,
  adminUpdatePost
);

export default router; 