// controllers/authController.js
import { signup as signupService, login as loginService } from '../services/authService.js';

export const signup = async (req, res) => {
  try {
    const { user, token } = await signupService(
      { username: req.body.username, email: req.body.email, password: req.body.password },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN || '7d'
    );

    const safe = { id: user._id, username: user.username, email: user.email, role: user.role };
    res.status(201).json({ user: safe, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await loginService(
      { email: req.body.email, password: req.body.password },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN || '7d'
    );

    const safe = { id: user._id, username: user.username, email: user.email, role: user.role };
    res.json({ user: safe, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
