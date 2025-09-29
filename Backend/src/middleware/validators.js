// middleware/validators.js
import { check, validationResult } from 'express-validator';

export const validateSignup = [
  check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

export const validateLogin = [
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').exists().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

export const validateUserUpdate = [
  check('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  check('email').optional().isEmail().withMessage('Invalid email address'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
