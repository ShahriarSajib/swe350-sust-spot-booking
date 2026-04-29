const blogModel = require('../models/blogModel');
const db = require('../config/db');

const createEventBlog = (req, res) => {
    // 1. Prepare Main Data
    const blogData = {
        bookingId: req.body.booking_id,
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        authorName: req.body.author_name || 'Admin',
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
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    let sql = `
        SELECT 
            eb.*, 
            ebc.*, 
            s.name AS spot_name 
        FROM event_blog eb
        LEFT JOIN event_blog_content ebc ON eb.blog_id = ebc.blog_id
        LEFT JOIN events e ON eb.event_id = e.id
        LEFT JOIN bookings b ON e.booking_id = b.booking_id
        LEFT JOIN spots s ON b.spot_id = s.spot_id
        WHERE eb.blog_status = 'published'
        ORDER BY eb.published_at DESC
    `;

    try {
        const [rows] = await db.query(sql);
        const blogsMap = new Map();

        rows.forEach(row => {
            if (!blogsMap.has(row.blog_id)) {
                blogsMap.set(row.blog_id, {
                    blog_id: row.blog_id,
                    event_id: row.event_id,
                    blog_title: row.blog_title,
                    summary: row.summary,
                    story_details: row.story_details,
                    author_name: row.author_name,
                    blog_status: row.blog_status,
                    submitted_at: row.submitted_at,
                    published_at: row.published_at,
                    cover_image: row.cover_image,
                    // This comes from the new JOINs
                    spot_name: row.spot_name || "Unknown Location", 
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

        let results = Array.from(blogsMap.values());
        if (limit !== null) {
            results = results.slice(0, limit);
        }

        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
};

const getUserPublishedBlogs = async (req, res) => {
    const { userId } = req.params; 

    // Updated SQL to filter specifically by user_id
    const sql = `
        SELECT 
            eb.*, 
            ebc.*, 
            s.name AS spot_name 
        FROM event_blog eb
        LEFT JOIN event_blog_content ebc ON eb.blog_id = ebc.blog_id
        LEFT JOIN events e ON eb.event_id = e.id
        LEFT JOIN bookings b ON e.booking_id = b.booking_id
        LEFT JOIN spots s ON b.spot_id = s.spot_id
        WHERE b.user_id = ? AND eb.blog_status = 'published'
        ORDER BY eb.published_at DESC
    `;

    try {
        const [rows] = await db.query(sql, [userId]);
        const blogsMap = new Map();

        rows.forEach(row => {
            // If this blog hasn't been added to the map yet, initialize it
            if (!blogsMap.has(row.blog_id)) {
                blogsMap.set(row.blog_id, {
                    blog_id: row.blog_id,
                    event_id: row.event_id,
                    blog_title: row.blog_title,
                    summary: row.summary,
                    story_details: row.story_details,
                    author_name: row.author_name,
                    blog_status: row.blog_status,
                    submitted_at: row.submitted_at,
                    published_at: row.published_at,
                    cover_image: row.cover_image,
                    spot_name: row.spot_name || "Unknown Location", 
                    schedules: [],
                    images: []
                });
            }

            const currentBlog = blogsMap.get(row.blog_id);

            // Push content into respective arrays based on content_type
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

        // Convert Map back to a simple Array and send as response
        const results = Array.from(blogsMap.values());
        res.status(200).json(results);

    } catch (err) {
        console.error("Error fetching user blogs:", err);
        res.status(500).json({ error: "Failed to fetch blogs for this user" });
    }
};

module.exports = { createEventBlog, getPublishedBlogs, getUserPublishedBlogs };