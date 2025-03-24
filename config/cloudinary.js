import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nifes-mentorship',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ 
      width: 500, 
      height: 500, 
      crop: 'fill',
      gravity: 'face',
      quality: 'auto:good'
    }],
    resource_type: 'auto'
  }
});

// Create multer upload instance with error handling
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 12 * 1024 * 1024 // 12MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('image');

// Wrap multer upload in error handling middleware
const uploadWithErrorHandling = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size must be less than 12MB' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

export {
  cloudinary,
  uploadWithErrorHandling as upload
}; 