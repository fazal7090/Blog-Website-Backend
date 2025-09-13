import express from 'express';
import { body } from 'express-validator';
import {
  adminDeleteUser,
 // adminGetAllUsers,
  adminUndoDeleteUser
} from '../controllers/admin_user_controller.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();


// Delete a user by userId
router.delete(
  '/user_delete',
  authMiddleware,
  requireAdmin,
  [
    body('userId').isInt().withMessage('Valid userId is required')
  ],
  adminDeleteUser
);

// // Get all users
// router.get(
//   '/all-users',
//   authMiddleware,
//   requireAdmin,
//   adminGetAllUsers
// );

// Undo delete a user by userId
router.put(
  '/user_undo_delete',
  authMiddleware,
  requireAdmin,
  [
    body('userId').isInt().withMessage('Valid userId is required')
  ],
  adminUndoDeleteUser
);

export default router;