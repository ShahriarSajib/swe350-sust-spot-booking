const fs = require('fs');

exports.deleteFile = (filePath) => {
  if (!filePath) return;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    // Optionally we could delete from Cloudinary here, but for now we just skip local fs deletion
    return;
  }
  fs.unlink(filePath, (err) => {
    if (err) console.log('File delete error:', err.message);
  });
};