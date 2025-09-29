import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import photoRoutes from './photoRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);      // <-- This is important
router.use('/users', userRoutes);
router.use('/photos', photoRoutes);

export default router;
