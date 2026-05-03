const db = require("../config/db");

// 🔹 Get notifications for logged-in user/admin
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || null;       // normal user
    const approverId = req.admin?.id || null;  // admin/approver

    const [rows] = await db.query(
      `SELECT * FROM notifications
       WHERE user_id = ? OR approver_id = ? OR recommender_id = ?
       ORDER BY created_at DESC`,
      [userId, approverId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE notification_id = ?`,
      [id]
    );

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const approverId = req.admin?.id || null;

    await db.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE user_id = ? OR approver_id = ?`,
      [userId, approverId]
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark all read error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const approverId = req.admin?.id || null;

    const [rows] = await db.query(
      `SELECT COUNT(*) AS count
       FROM notifications
       WHERE (user_id = ? OR approver_id = ?)
       AND is_read = FALSE`,
      [userId, approverId]
    );

    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Unread count error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
