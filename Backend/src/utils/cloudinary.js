// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary
export const configure = ({ cloud_name, api_key, api_secret }) => {
  cloudinary.config({ cloud_name, api_key, api_secret });
};

// Upload buffer to Cloudinary
export const uploadBuffer = (buffer, folder = 'photos') =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

// Delete a file from Cloudinary
export const destroy = (public_id) => cloudinary.uploader.destroy(public_id);

// Optional: export cloudinary instance if needed
export { cloudinary };
