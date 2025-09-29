// routes/photoRoutes.js
import express from 'express';
const router = express.Router();

import { getAllPhotos, getPhotos, uploadPhoto, deletePhoto } from '../controllers/photoController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

router.get('/', auth, getAllPhotos);
router.get('/user/:userId', auth, getPhotos);
router.post('/', auth, upload.single('image'), uploadPhoto);
router.delete('/:id', auth, deletePhoto);

export default router;
