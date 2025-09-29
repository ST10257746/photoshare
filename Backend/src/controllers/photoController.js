// src/controllers/photoController.js
import Photo from '../models/Photo.js';
import { uploadBuffer, destroy } from '../utils/cloudinary.js';

export const getPhotos = async (req, res) => {
  try {
    const userId = req.params.userId;
    const photos = await Photo.find({ owner: userId }).populate('owner', 'username email');
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().populate('owner', 'username email role');
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: 'Image file required' });

    const { title, description } = req.body;
    const result = await uploadBuffer(req.file.buffer, 'photos');

    const photo = await Photo.create({
      url: result.secure_url,
      public_id: result.public_id,
      title,
      description,
      owner: req.user._id
    });

    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    if (String(photo.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (photo.public_id) await destroy(photo.public_id);
    await photo.remove();

    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
