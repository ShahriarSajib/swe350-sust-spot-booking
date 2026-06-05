const db = require('../config/db');

const saveBlog = async (data, contentItems, callback) => {
    let connection;
    try {
        // Get a connection from the promise-based pool
        connection = await db.getConnection();

        // Start transaction
        await connection.beginTransaction();

        // Find or create event_id using booking_id
        // First, check if an event entry already exists for this booking
        const [existingEvents] = await connection.query(
            'SELECT id FROM events WHERE booking_id = ?',
            [data.bookingId]
        );

        let event_id;

        if (existingEvents.length > 0) {
            // Event already exists, use its id
            event_id = existingEvents[0].id;
        } else {
            // No event row exists for this booking — create one
            const [insertResult] = await connection.query(
                'INSERT INTO events (booking_id) VALUES (?)',
                [data.bookingId]
            );
            event_id = insertResult.insertId;
        }

        // Insert into event_blog
        const blogQuery = `INSERT INTO event_blog (event_id, blog_title, summary, story_details, author_name, cover_image) VALUES (?, ?, ?, ?, ?, ?)`;
        const [blogResult] = await connection.query(blogQuery, [
            event_id,
            data.title,
            data.summary,
            data.content,
            data.authorName,
            data.coverImage
        ]);

        const blog_id = blogResult.insertId;

        // Insert contentItems only if there are any
        if (contentItems && contentItems.length > 0) {
            const values = contentItems.map(item => [
                blog_id,
                item.type,
                item.time || null,
                item.title || null,
                item.description || null,
                item.imagePath || null,
                item.imageCaption || null
            ]);

            const contentQuery = `INSERT INTO event_blog_content 
                (blog_id, content_type, activity_time, activity_title, activity_description, image_path, image_caption) 
                VALUES ?`;

            await connection.query(contentQuery, [values]);
        }

        // Commit the transaction
        await connection.commit();
        connection.release();
        callback(null, { blog_id });

    } catch (err) {
        console.error("Blog save error:", err);
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackErr) {
                console.error("Rollback error:", rollbackErr);
            }
            connection.release();
        }
        callback(err);
    }
};

module.exports = { saveBlog };