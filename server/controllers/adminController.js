const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Admin = require("../models/adminModel");

// LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.approver_id },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ token, admin });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getProfile = async (req, res) => {
  try {
    const admin = await Admin.getAdminById(req.admin.id);
    res.json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateProfile = async (req, res) => {
  try {
    await Admin.updateAdmin(req.admin.id, req.body);
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const [rows] = await db.query(
      "SELECT password FROM approver WHERE approver_id = ?",
      [req.admin.id]
    );

    const admin = rows[0];

    const match = await bcrypt.compare(oldPassword, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE approver SET password = ? WHERE approver_id = ?",
      [hashed, req.admin.id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json(err);
  }
};

const logoutAdmin = async (req, res) => {
  // Frontend will remove token
  res.json({ message: "Logged out successfully" });
};

// ENHANCED DASHBOARD - includes recommender info in pending bookings
const dashboard = async (req, res) => {
  try {
    // Overall booking stats
    const [[stats]] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(booking_status = 'pending') AS pending,
        SUM(booking_status = 'approved') AS approved,
        SUM(booking_status = 'rejected') AS rejected
      FROM bookings
    `);

    const [[spotsRow]] = await db.query(
      "SELECT COUNT(*) AS total_spots FROM spots"
    );

    // Recent activity: last 5 bookings with user + spot names
    const [recent] = await db.query(`
      SELECT b.booking_id, b.booking_status, b.timestamp,
             b.title AS event_title, b.start_date,
             u.full_name, s.name AS spot_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN spots s ON b.spot_id = s.spot_id
      ORDER BY b.timestamp DESC
      LIMIT 5
    `);

    // Pending bookings WITH full recommender info via JOIN
    const [pending] = await db.query(`
      SELECT
        b.booking_id, b.title AS event_title, b.start_date, b.end_date,
        b.session, b.description, b.start_time, b.end_time,
        b.timestamp, b.organizer, b.booking_type,
        u.full_name, u.department AS dept, u.email AS user_email,
        u.contact_number,
        s.name AS spot_name,
        rec_user.full_name AS recommender_name,
        rec_user.department AS recommender_dept,
        r.recommender_designation AS recommender_post
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN spots s ON b.spot_id = s.spot_id
      LEFT JOIN recommendations r ON b.booking_id = r.booking_id
      LEFT JOIN users rec_user ON r.recommender_user_id = rec_user.id
      WHERE b.booking_status = 'pending'
      ORDER BY b.timestamp DESC
    `);

    // Upcoming approved events (next 30 days)
    const [upcoming] = await db.query(`
      SELECT b.booking_id, b.title AS event_title, b.start_date, b.end_date,
             s.name AS spot_name
      FROM bookings b
      JOIN spots s ON b.spot_id = s.spot_id
      WHERE b.booking_status = 'approved'
        AND b.start_date >= CURDATE()
        AND b.start_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY b.start_date ASC
      LIMIT 5
    `);

    res.json({ stats, spots: spotsRow, recent, pending, upcoming });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json(err);
  }
};

// GET ALL BOOKINGS (with user + spot names)
const getBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, u.full_name, s.name AS spot_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN spots s ON b.spot_id = s.spot_id
      ORDER BY b.timestamp DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingleBooking = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.full_name, s.name AS spot_name,
              rec_user.full_name AS recommender_name,
              r.recommender_designation AS recommender_post
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN spots s ON b.spot_id = s.spot_id
       LEFT JOIN recommendations r ON b.booking_id = r.booking_id
       LEFT JOIN users rec_user ON r.recommender_user_id = rec_user.id
       WHERE b.booking_id = ?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

// APPROVE BOOKING
const approveBooking = async (req, res) => {
  const bookingId = req.params.id;
  const adminId = req.admin.id;

  try {
    // Check if approval record already exists
    const [existing] = await db.query(
      "SELECT booking_id FROM approval WHERE booking_id = ?",
      [bookingId]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE approval SET approver_id = ?, decision_time = NOW(), approvers_remarks = NULL
         WHERE booking_id = ?`,
        [adminId, bookingId]
      );
    } else {
      await db.query(
        `INSERT INTO approval (booking_id, approver_id, decision_time)
         VALUES (?, ?, NOW())`,
        [bookingId, adminId]
      );
    }

    await db.query(
      `UPDATE bookings SET booking_status = 'approved' WHERE booking_id = ?`,
      [bookingId]
    );

    // Add to availability calendar if not already there
    const [calExisting] = await db.query(
      "SELECT booking_id FROM availability_calendar WHERE booking_id = ?",
      [bookingId]
    );
    if (calExisting.length === 0) {
      await db.query(
        `INSERT INTO availability_calendar (booking_id, spot_id, start_date, end_date)
         SELECT booking_id, spot_id, start_date, end_date
         FROM bookings WHERE booking_id = ?`,
        [bookingId]
      );
    }

    res.json({ message: "Booking approved" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json(err);
  }
};

// REJECT BOOKING (stores reason)
const rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const bookingId = req.params.id;
    const adminId = req.admin.id;

    await db.query(
      `UPDATE bookings SET booking_status = 'rejected' WHERE booking_id = ?`,
      [bookingId]
    );

    // Store rejection remark in approval table
    const [existing] = await db.query(
      "SELECT booking_id FROM approval WHERE booking_id = ?",
      [bookingId]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE approval SET approver_id = ?, approvers_remarks = ?, decision_time = NOW()
         WHERE booking_id = ?`,
        [adminId, reason || null, bookingId]
      );
    } else {
      await db.query(
        `INSERT INTO approval (booking_id, approver_id, approvers_remarks, decision_time)
         VALUES (?, ?, ?, NOW())`,
        [bookingId, adminId, reason || null]
      );
    }

    res.json({ message: "Booking rejected" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json(err);
  }
};

const filterBookings = async (req, res) => {
  try {
    const { status, spot_id, start_date, end_date } = req.query;

    let query = `
      SELECT b.*, u.full_name, s.name AS spot_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN spots s ON b.spot_id = s.spot_id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += " AND b.booking_status = ?";
      params.push(status);
    }

    if (spot_id) {
      query += " AND b.spot_id = ?";
      params.push(spot_id);
    }

    if (start_date && end_date) {
      query += " AND b.start_date BETWEEN ? AND ?";
      params.push(start_date, end_date);
    }

    query += " ORDER BY b.timestamp DESC";

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ── SPOT MANAGEMENT ──────────────────────────────────────────────────────────

const getSpots = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM spots ORDER BY spot_id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingleSpot = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM spots WHERE spot_id = ?",
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Spot not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createSpot = async (req, res) => {
  try {
    const { name, description, location } = req.body;
    await db.query(
      `INSERT INTO spots (name, description, location) VALUES (?, ?, ?)`,
      [name, description, location]
    );
    res.json({ message: "Spot created" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE SPOT - includes spot_rules field
const updateSpot = async (req, res) => {
  try {
    const { name, description, location, spot_rules } = req.body;
    await db.query(
      `UPDATE spots SET name = ?, description = ?, location = ?, spot_rules = ? WHERE spot_id = ?`,
      [name, description, location, spot_rules || null, req.params.id]
    );
    res.json({ message: "Spot updated" });
  } catch (err) {
    console.error("Update spot error:", err);
    res.status(500).json(err);
  }
};

const deleteSpot = async (req, res) => {
  try {
    await db.query("DELETE FROM spots WHERE spot_id = ?", [req.params.id]);
    res.json({ message: "Spot deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const reserveSpotByAdmin = async (req, res) => {
  try {
    const {
      spot_id,
      start_date,
      end_date,
      session,
      title,
      description,
      start_time,
      end_time
    } = req.body;

    // 1. Cancel conflicting bookings
    await db.query(`
      UPDATE bookings
      SET booking_status = 'cancelled'
      WHERE spot_id = ?
      AND booking_status = 'approved'
      AND (
        (start_date <= ? AND (end_date IS NULL OR end_date >= ?))
      )
    `, [spot_id, start_date, start_date]);

    // 2. Create admin booking (user_id = NULL or 0)
    const [result] = await db.query(`
      INSERT INTO bookings
      (user_id, spot_id, booking_type, booking_status, title,
       start_date, end_date, session, description, start_time, end_time)
      VALUES (NULL, ?, 'internal', 'approved', ?, ?, ?, ?, ?, ?, ?)
    `, [
      spot_id,
      title || "Admin Reserved",
      start_date,
      end_date || null,
      session,
      description || "Reserved by admin",
      start_time || null,
      end_time || null
    ]);

    const bookingId = result.insertId;

    // 3. Insert into availability calendar
    await db.query(`
      INSERT INTO availability_calendar (booking_id, spot_id, start_date, end_date)
      VALUES (?, ?, ?, ?)
    `, [bookingId, spot_id, start_date, end_date]);

    res.json({ message: "Spot reserved by admin", bookingId });

  } catch (err) {
    console.error("Reserve spot error:", err);
    res.status(500).json(err);
  }
};

// ── SPOT RECIPIENTS ────────────────────────────────────────────────────────────

const getSpotRecipients = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM approval_copy_recipients WHERE spot_id = ? ORDER BY id ASC",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateSpotRecipients = async (req, res) => {
  try {
    const { recipients } = req.body; // array of { name, email }
    const spotId = req.params.id;

    // Delete old recipients for this spot
    await db.query(
      "DELETE FROM approval_copy_recipients WHERE spot_id = ?",
      [spotId]
    );

    // Insert new ones (recipient_designation maps to 'name' in frontend)
    if (recipients && recipients.length > 0) {
      const values = recipients
        .filter(r => r.email) // skip empty rows
        .map(r => [spotId, r.email, r.name || ""]);

      if (values.length > 0) {
        await db.query(
          "INSERT INTO approval_copy_recipients (spot_id, recipient_email, recipient_designation) VALUES ?",
          [values]
        );
      }
    }

    res.json({ message: "Recipients updated" });
  } catch (err) {
    console.error("Update recipients error:", err);
    res.status(500).json(err);
  }
};

// ── BLOG MODERATION ───────────────────────────────────────────────────────────

const getBlogs = async (req, res) => {
  try {
    const { status } = req.query; // 'pending' or 'published'

    // Build optional status filter
    let whereClause = "";
    const params = [];
    if (status && status !== "all") {
      whereClause = "WHERE eb.blog_status = ?";
      params.push(status);
    }

    const [blogs] = await db.query(`
      SELECT eb.blog_id, eb.blog_title, eb.summary, eb.story_details,
             eb.blog_status, eb.submitted_at, eb.cover_image,
             u.full_name AS author,
             s.name AS spot_name,
             bk.start_date AS event_date
      FROM event_blog eb
      JOIN events ev ON eb.event_id = ev.id
      JOIN bookings bk ON ev.booking_id = bk.booking_id
      JOIN users u ON bk.user_id = u.id
      JOIN spots s ON bk.spot_id = s.spot_id
      ${whereClause}
      ORDER BY eb.submitted_at DESC
    `, params);

    res.json(blogs);
  } catch (err) {
    console.error("Get blogs error:", err);
    // Return empty array gracefully so frontend doesn't crash
    res.json([]);
  }
};

const publishBlog = async (req, res) => {
  try {
    await db.query(
      "UPDATE event_blog SET blog_status = 'published' WHERE blog_id = ?",
      [req.params.id]
    );
    res.json({ message: "Blog published" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const rejectBlog = async (req, res) => {
  try {
    await db.query(
      "UPDATE event_blog SET blog_status = 'rejected' WHERE blog_id = ?",
      [req.params.id]
    );
    res.json({ message: "Blog rejected" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteBlog = async (req, res) => {
  try {
    await db.query("DELETE FROM event_blog WHERE blog_id = ?", [req.params.id]);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ── FEEDBACKS ─────────────────────────────────────────────────────────────────

const getFeedbacks = async (req, res) => {
  try {
    const [feedbacks] = await db.query(`
      SELECT ev.id AS event_id, ev.feedback,
             bk.title AS event_title, bk.start_date AS event_date,
             s.name AS spot_name,
             u.full_name AS user_name
      FROM events ev
      JOIN bookings bk ON ev.booking_id = bk.booking_id
      JOIN spots s ON bk.spot_id = s.spot_id
      JOIN users u ON bk.user_id = u.id
      WHERE ev.feedback IS NOT NULL AND ev.feedback != ''
      ORDER BY bk.start_date DESC
    `);
    res.json(feedbacks);
  } catch (err) {
    console.error("Get feedbacks error:", err);
    res.json([]);
  }
};

// ── REPORTS ───────────────────────────────────────────────────────────────────

const getReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    const [rows] = await db.query(
      `SELECT b.*, u.full_name, s.name AS spot_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN spots s ON b.spot_id = s.spot_id
       WHERE b.start_date BETWEEN ? AND ?
       ORDER BY b.start_date ASC`,
      [start, end]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  changePassword,
  getProfile,
  updateProfile,
  dashboard,
  getBookings,
  getSingleBooking,
  approveBooking,
  rejectBooking,
  filterBookings,
  getSpots,
  getSingleSpot,
  createSpot,
  updateSpot,
  deleteSpot,
  reserveSpotByAdmin,
  getSpotRecipients,
  updateSpotRecipients,
  getBlogs,
  publishBlog,
  rejectBlog,
  deleteBlog,
  getFeedbacks,
  getReport
};