// src/services/userService.js
import User from '../models/User.js';
import { uploadBuffer, destroy } from '../utils/cloudinary.js';

/**
 * Get current user profile
 */
export const getMe = async (userId) => {
  return await User.findById(userId).select('-password');
};

/**
 * Update user profile (username, email, and/or profile picture)
 */
export const updateMe = async (userId, updateData, file) => {
  const update = {};

  if (updateData.username) update.username = updateData.username;
  if (updateData.email) update.email = updateData.email;

  // Handle profile picture upload
  if (file && file.buffer) {
    const user = await User.findById(userId);

    // Remove old picture from Cloudinary if it exists
    if (user && user.profilePicturePublicId) {
      await destroy(user.profilePicturePublicId);
    }

    // Upload new picture
    const result = await uploadBuffer(file.buffer, 'profilepictures');
    update.profilePictureUrl = result.secure_url;
    update.profilePicturePublicId = result.public_id;
  }

  return await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  return await User.find().select('-password');
};

/**
 * Get single user by ID (admin only)
 */
export const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

/**
 * Promote user to admin
 */
export const promoteUser = async (id) => {
  return await User.findByIdAndUpdate(id, { role: 'admin' }, { new: true }).select('-password');
};

/**
 * Demote user to normal
 */
export const demoteUser = async (id) => {
  return await User.findByIdAndUpdate(id, { role: 'user' }, { new: true }).select('-password');
};

/**
 * Delete user by ID
 */
export const deleteUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) return null;

  if (user.profilePicturePublicId) {
    await destroy(user.profilePicturePublicId);
  }

  await user.remove();
  return true;
};
