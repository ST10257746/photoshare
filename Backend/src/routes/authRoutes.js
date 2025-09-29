// routes/authRoutes.js
import express from 'express';
const router = express.Router();

import { signup, login } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middleware/validators.js';

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

export default router;
