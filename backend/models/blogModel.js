const db = require('../db');

const saveBlog = (data, contentItems, callback) => {
    // 1. Get a connection for the transaction
    db.getConnection((err, connection) => {
        if (err) return callback(err);

        // 2. Start Transaction
        connection.beginTransaction((err) => {
            if (err) { connection.release(); return callback(err); }

            // 3. Find event_id using booking_id
            connection.query('SELECT id FROM events WHERE booking_id = ?', [data.bookingId], (err, results) => {
                if (err || results.length === 0) {
                    return connection.rollback(() => { connection.release(); callback(err || new Error("Event not found")); });
                }

                const event_id = results[0].id;

                // 4. Insert into event_blog
                const blogQuery = `INSERT INTO event_blog (event_id, blog_title, summary, story_details, cover_image) VALUES (?, ?, ?, ?, ?)`;
                connection.query(blogQuery, [event_id, data.title, data.summary, data.content, data.coverImage], (err, blogResult) => {
                    if (err) {
                        return connection.rollback(() => { connection.release(); callback(err); });
                    }

                    const blog_id = blogResult.insertId;

                    // 5. Insert contentItems (Bulk Insert)
                    // We map the array of content to a nested array for MySQL bulk insert: [[val1, val2], [val1, val2]]
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

                    connection.query(contentQuery, [values], (err) => {
                        if (err) {
                            return connection.rollback(() => { connection.release(); callback(err); });
                        }

                        // 6. Success! Commit
                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => { connection.release(); callback(err); });
                            }
                            connection.release();
                            callback(null, { blog_id });
                        });
                    });
                });
            });
        });
    });
};

module.exports = { saveBlog };