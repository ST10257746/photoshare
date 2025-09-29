// services/authService.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (user, secret, expiresIn) => {
  return jwt.sign({ id: user._id }, secret, { expiresIn });
};

export const signup = async ({ username, email, password }, jwtSecret, jwtExpiresIn) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');

  const user = new User({ username, email, password });
  await user.save();

  const token = createToken(user, jwtSecret, jwtExpiresIn);
  return { user, token };
};

export const login = async ({ email, password }, jwtSecret, jwtExpiresIn) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid credentials');

  const token = createToken(user, jwtSecret, jwtExpiresIn);
  return { user, token };
};
