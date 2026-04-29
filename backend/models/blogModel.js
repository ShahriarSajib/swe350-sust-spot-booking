const db = require('../config/db');

const saveBlog = (data, contentItems, callback) => {
    
    db.getConnection((err, connection) => {
        if (err) return callback(err);

      
        connection.beginTransaction((err) => {
            if (err) { connection.release(); return callback(err); }

            //Find event_id using booking_id
            connection.query('SELECT id FROM events WHERE booking_id = ?', [data.bookingId], (err, results) => {
                if (err || results.length === 0) {
                    return connection.rollback(() => { connection.release(); callback(err || new Error("Event not found")); });
                }

                const event_id = results[0].id;

                //Insert into event_blog
                const blogQuery = `INSERT INTO event_blog (event_id, blog_title, summary, story_details, author_name, cover_image) VALUES (?, ?, ?, ?, ?, ?)`;
                connection.query(blogQuery, [event_id, data.title, data.summary, data.content, data.authorName, data.coverImage], (err, blogResult) => {
                    if (err) {
                        return connection.rollback(() => { connection.release(); callback(err); });
                    }

                    const blog_id = blogResult.insertId;

                    //  Insert contentItems
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