const multer = require('multer');
const { storage } = require('../config/cloudinary');

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

exports.uploadSingle = upload.single('idFile');

exports.uploadFields = upload.fields([
  { name: 'profile_picture', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]);
exports.uploadNone = upload.none();