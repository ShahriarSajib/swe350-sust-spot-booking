const blogModel = require('../models/blogModel');
const db = require('../config/db');

const createEventBlog = (req, res) => {
    // 1. Prepare Main Data
    const blogData = {
        bookingId: req.body.booking_id,
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        coverImage: req.files['coverImage'] ? req.files['coverImage'][0].filename : null
    };


    let contentItems = [];

    // Parse Schedules 
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

    // Parse Images 
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

    // Call the model
    blogModel.saveBlog(blogData, contentItems, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to publish blog", details: err.message });
        }
        res.status(200).json({ message: "Blog published successfully", blogId: result.blog_id });
    });
};

const getPublishedBlogs = async (req, res) => {
    // 1. Get limit from URL query (?limit=4)
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    let sql = `
        SELECT eb.*, ebc.* FROM event_blog eb
        LEFT JOIN event_blog_content ebc ON eb.blog_id = ebc.blog_id
        WHERE eb.blog_status = 'published'
        ORDER BY eb.published_at DESC
    `;

    try {
        const [rows] = await db.query(sql);

        // We use a Map to preserve the insertion order from the SQL query
        const blogsMap = new Map();

        rows.forEach(row => {
            if (!blogsMap.has(row.blog_id)) {
                blogsMap.set(row.blog_id, {
                    blog_id: row.blog_id,
                    event_id: row.event_id,
                    blog_title: row.blog_title,
                    summary: row.summary,
                    story_details: row.story_details,
                    blog_status: row.blog_status,
                    submitted_at: row.submitted_at,
                    published_at: row.published_at,
                    cover_image: row.cover_image,
                    schedules: [],
                    images: []
                });
            }

            const currentBlog = blogsMap.get(row.blog_id);

            if (row.content_type === 'schedule') {
                currentBlog.schedules.push({
                    time: row.activity_time,
                    activity: row.activity_title,
                    description: row.activity_description 
                });
            } else if (row.content_type === 'image') {
                currentBlog.images.push({
                    image_path: row.image_path, 
                    image_caption: row.image_caption
                });
            }
        });

        // Convert Map back to an array
        let results = Array.from(blogsMap.values());

        // 2. Apply the limit if it exists
        if (limit) {
            results = results.slice(0, limit);
        }

        res.status(200).json(results);

    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
};

module.exports = { createEventBlog, getPublishedBlogs };