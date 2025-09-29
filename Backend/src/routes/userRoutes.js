// routes/userRoutes.js
import express from 'express';
const router = express.Router();

import {
  getMe,
  updateMe,
  getAllUsers,
  getUserById,
  promoteUser,
  demoteUser,
  deleteUserById
} from '../controllers/userController.js';

import auth from '../middleware/auth.js';
import rbac from '../middleware/rbac.js';
import upload from '../middleware/upload.js';
import { validateUserUpdate } from '../middleware/validators.js';

router.get('/me', auth, getMe);
router.put('/me', auth, upload.single('profilePicture'), validateUserUpdate, updateMe);

router.get('/', auth, rbac, getAllUsers);
router.get('/:id', auth, rbac, getUserById);
router.put('/:id/promote', auth, rbac, promoteUser);
router.put('/:id/demote', auth, rbac, demoteUser);
router.delete('/:id', auth, rbac, deleteUserById);

export default router;
