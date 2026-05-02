const db = require("../config/db");

exports.createNotification = async ({
  user_id = null,
  approver_id = null,
  recommender_id = null,
  booking_id,
  title,
  message,
}) => {
  // enforce only one receiver
  const receivers = [user_id, approver_id, recommender_id];
  const count = receivers.filter(v => v !== null).length;

  if (count !== 1) {
    throw new Error("Exactly one receiver must be set");
  }

  await db.query(
    `INSERT INTO notifications 
     (user_id, approver_id, recommender_id, booking_id, title, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, approver_id, recommender_id, booking_id, title, message]
  );
};