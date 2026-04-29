const blogModel = require('../models/blogModel');

const createEventBlog = (req, res) => {
    // 1. Prepare Main Data
    const blogData = {
        bookingId: req.body.booking_id,
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        coverImage: req.files['coverImage'] ? req.files['coverImage'][0].filename : null
    };

    // 2. Prepare Content Items Array
    let contentItems = [];

    // Parse Schedules (Assuming they come as a JSON string from frontend)
    const schedules = JSON.parse(req.body.scheduleData || '[]');
    schedules.forEach(s => {
        contentItems.push({
            type: 'schedule',
            time: s.time,
            title: s.activity,
            description: s.description,
            imagePath: null,
            imageCaption: null
        });
    });

    // Parse Images (Uploaded files)
    const galleryFiles = req.files['galleryImages'] || [];
    const captions = JSON.parse(req.body.captions || '[]');
    
    galleryFiles.forEach((file, index) => {
        contentItems.push({
            type: 'image',
            time: null, title: null, description: null,
            imagePath: file.filename,
            imageCaption: captions[index] || ''
        });
    });

    // 3. Call the model
    blogModel.saveBlog(blogData, contentItems, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to publish blog", details: err.message });
        }
        res.status(200).json({ message: "Blog published successfully", blogId: result.blog_id });
    });
};

module.exports = { createEventBlog };