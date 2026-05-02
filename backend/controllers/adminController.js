const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Admin = require("../models/adminModel");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// ── AUTH ─────────────────────────────────────────────────────────────────────

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const admin = await Admin.findAdminByEmail(email);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // ⚠️ Plain text password comparison (NOT SECURE, but your request)
    if (password !== admin.password)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: admin.approver_id,
        role: "approver",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      admin: {
        approver_id: admin.approver_id,
        approver_name: admin.approver_name,
        approver_email: admin.approver_email,
        approver_designation: admin.approver_designation,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const logoutAdmin = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Both passwords are required" });

    const [rows] = await db.query(
      "SELECT password FROM approver WHERE approver_id = ?",
      [req.admin.id],
    );
    if (!rows[0]) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(oldPassword, rows[0].password);
    if (!match)
      return res.status(400).json({ message: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE approver SET password = ? WHERE approver_id = ?", [
      hashed,
      req.admin.id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── PROFILE ───────────────────────────────────────────────────────────────────

const getProfile = async (req, res) => {
  try {
    const admin = await Admin.getAdminById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    await Admin.updateAdmin(req.admin.id, req.body);
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSignature = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename; // ✅ FIXED

    await Admin.updateSignature(req.admin.id, fileName);

    res.json({
      message: "Signature updated",
      filename: fileName,
    });
  } catch (err) {
    console.error("Update signature error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

const dashboard = async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(booking_status = 'pending') AS pending,
        SUM(booking_status = 'approved') AS approved,
        SUM(booking_status = 'rejected') AS rejected
      FROM bookings
    `);

    const [[spotsRow]] = await db.query(
      "SELECT COUNT(*) AS total_spots FROM spots",
    );

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

    const [pending] = await db.query(`
      SELECT
        b.booking_id, b.title AS event_title, b.start_date, b.end_date,
        b.session, b.description, b.start_time, b.end_time,
        b.timestamp, b.organizer,
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
    res.status(500).json({ message: "Server error" });
  }
};

// ── BOOKINGS ──────────────────────────────────────────────────────────────────

const getAllBookings = async (req, res) => {
  try {
    const { status, spot_id, start_date, end_date } = req.query;
    const adminId = req.admin.id; // logged-in approver

    let query = `
      SELECT 
        b.booking_id, b.booking_status, b.timestamp, b.start_date, b.end_date,
        b.session, b.title AS event_title, b.start_time, b.end_time, b.description,
        b.current_approval_point,
        u.full_name, u.department AS dept, u.contact_number,
        s.name AS spot_name,
        s.approval_order,
        ru.full_name AS recommender_name,
        rec.recommender_designation AS recommender_post,
        ru.department AS recommender_dept,
        ru.email as recommender_email
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN spots s ON b.spot_id = s.spot_id
      LEFT JOIN recommendations rec ON b.booking_id = rec.booking_id
      LEFT JOIN users ru ON rec.recommender_user_id = ru.id
      WHERE 1=1 AND b.is_recommended = 1
    `;

    const params = [];

    // Optional filters (keep your existing ones)
    if (status && status !== "all") {
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

    // 🔥 FILTER based on approval flow
   const filtered = rows.filter((b) => {
  if (!b.approval_order) return false;
  if (b.current_approval_point == null) return false;

  let order;

  try {
    order =
      typeof b.approval_order === "string"
        ? JSON.parse(b.approval_order)
        : b.approval_order;
  } catch {
    return false;
  }

  if (!Array.isArray(order)) return false;

  order = order.map(Number);

  if (b.current_approval_point >= order.length) return false;

  const currentApprover = order[b.current_approval_point];

  return Number(currentApprover) === Number(adminId);
});

    res.json(filtered);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleBooking = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.full_name, u.department AS dept, u.contact_number,
              s.name AS spot_name,
              rec_user.full_name AS recommender_name,
              r.recommender_designation AS recommender_post
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN spots s ON b.spot_id = s.spot_id
       LEFT JOIN recommendations r ON b.booking_id = r.booking_id
       LEFT JOIN users rec_user ON r.recommender_user_id = rec_user.id
       WHERE b.booking_id = ?`,
      [req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ message: "Booking not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Get booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getAdminBookingHistory = async (req, res) => {
  try {
    const adminId = req.admin.id;

    let query = `
      SELECT 
        b.booking_id,
        b.booking_status,
        b.timestamp,
        b.start_date,
        b.end_date,
        b.session,
        b.title AS event_title,
        b.start_time,
        b.end_time,
        b.description,
        b.current_approval_point,

        u.full_name,
        u.department AS dept,
        u.contact_number,

        s.name AS spot_name,
        s.approval_order,

        ru.full_name AS recommender_name,
        rec.recommender_designation AS recommender_post,
        ru.department AS recommender_dept,

        ap.approver_id

      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN spots s ON b.spot_id = s.spot_id
      LEFT JOIN recommendations rec ON b.booking_id = rec.booking_id
      LEFT JOIN users ru ON rec.recommender_user_id = ru.id
      LEFT JOIN approval ap ON b.booking_id = ap.booking_id

      WHERE b.is_recommended = 1
      AND(

        ap.approver_id = ?
        OR JSON_CONTAINS(s.approval_order, CAST(? AS JSON), '$')
      )
    `;

    const params = [adminId, adminId];

    query += " ORDER BY b.timestamp DESC";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const approveBooking = async (req, res) => {
  const bookingId = req.params.id;
  const adminId = req.admin.id;

  try {
    // 🔹 1. Get booking + approval order
    const [rows] = await db.query(
      `SELECT b.current_approval_point, b.spot_id,
              s.approval_order
       FROM bookings b
       JOIN spots s ON b.spot_id = s.spot_id
       WHERE b.booking_id = ?`,
      [bookingId],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    // 🔹 2. Parse approval order
    let order;
    try {
      order =
        typeof booking.approval_order === "string"
          ? JSON.parse(booking.approval_order)
          : booking.approval_order;
    } catch {
      return res.status(400).json({ message: "Invalid approval order" });
    }

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "No approval flow set" });
    }

    const currentStep = booking.current_approval_point;

    // 🔹 3. SECURITY CHECK (very important 🚨)
    if (order[currentStep] !== adminId) {
      return res.status(403).json({ message: "Not authorized for this step" });
    }

    // 🔹 4. Save approval record
    const [existing] = await db.query(
      "SELECT booking_id FROM approval WHERE booking_id = ? AND approver_id = ?",
      [bookingId, adminId],
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE approval 
         SET decision_time = NOW(), approvers_remarks = NULL 
         WHERE booking_id = ? AND approver_id = ?`,
        [bookingId, adminId],
      );
    } else {
      await db.query(
        `INSERT INTO approval (booking_id, approver_id, decision_time) 
         VALUES (?, ?, NOW())`,
        [bookingId, adminId],
      );
    }

    // 🔹 5. Move to next step OR final approve
    const nextStep = currentStep + 1;

    if (nextStep >= order.length) {
      // ✅ FINAL APPROVAL
      await db.query(
        `UPDATE bookings 
         SET booking_status = 'approved', current_approval_point = ?
         WHERE booking_id = ?`,
        [nextStep, bookingId],
      );

      // insert into availability_calendar (only once)
      const [calExisting] = await db.query(
        "SELECT booking_id FROM availability_calendar WHERE booking_id = ?",
        [bookingId],
      );

      if (calExisting.length === 0) {
        await db.query(
          `INSERT INTO availability_calendar (booking_id, spot_id, start_date, end_date)
           SELECT booking_id, spot_id, start_date, end_date 
           FROM bookings WHERE booking_id = ?`,
          [bookingId],
        );
      }

      return res.json({ message: "Booking fully approved" });
    } else {
      // 🔁 MOVE TO NEXT APPROVER
      await db.query(
        `UPDATE bookings 
         SET current_approval_point = ?
         WHERE booking_id = ?`,
        [nextStep, bookingId],
      );

      return res.json({ message: "Forwarded to next approver" });
    }
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const bookingId = req.params.id;
    const adminId = req.admin.id;

    await db.query(
      `UPDATE bookings SET booking_status = 'rejected' WHERE booking_id = ?`,
      [bookingId],
    );

    const [existing] = await db.query(
      "SELECT booking_id FROM approval WHERE booking_id = ?",
      [bookingId],
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE approval SET approver_id = ?, approvers_remarks = ?, decision_time = NOW() WHERE booking_id = ?`,
        [adminId, reason || null, bookingId],
      );
    } else {
      await db.query(
        `INSERT INTO approval (booking_id, approver_id, approvers_remarks, decision_time) VALUES (?, ?, ?, NOW())`,
        [bookingId, adminId, reason || null],
      );
    }

    res.json({ message: "Booking rejected" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin self-reserve
const reserveSpotByAdmin = async (req, res) => {
  try {
    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized: admin id missing",
      });
    }

    const {
      spot_id,
      start_date,
      end_date,
      session,
      title,
      description,
      start_time,
      end_time,
    } = req.body;

    if (!spot_id || !start_date || !session) {
      return res.status(400).json({
        message: "spot_id, start_date and session are required",
      });
    }

    // ✅ 1. Get admin email from approver table
    const [approverRows] = await db.query(
      `SELECT approver_email FROM approver WHERE approver_id = ?`,
      [adminId]
    );

    if (approverRows.length === 0) {
      return res.status(404).json({
        message: "Admin not found in approver table",
      });
    }

    const adminEmail = approverRows[0].approver_email;
    console.log("✅ Admin email:", adminEmail);

    // ✅ 2. Get user_id from users table using email
    const [userRows] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
      [adminEmail]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        message: "Admin not found in users table",
      });
    }

    const adminUserId = userRows[0].id;
    console.log("✅ Admin user_id:", adminUserId);

    // ✅ 3. Cancel conflicting bookings
    await db.query(
      `UPDATE bookings 
       SET booking_status = 'cancelled'
       WHERE spot_id = ? 
         AND booking_status = 'approved'
         AND start_date <= ? 
         AND (end_date IS NULL OR end_date >= ?)`,
      [spot_id, end_date || start_date, start_date]
    );

    // ✅ 4. Insert booking
    const [result] = await db.query(
      `INSERT INTO bookings
      (user_id, spot_id, booking_status, title, start_date, end_date, session, description, start_time, end_time)
      VALUES (?, ?, 'approved', ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminUserId,
        spot_id,
        title || "Admin Reserved",
        start_date,
        end_date || null,
        session,
        description || "",
        start_time || null,
        end_time || null,
      ]
    );

    const bookingId = result.insertId;

    // ✅ 5. Insert into availability calendar
    await db.query(
      `INSERT INTO availability_calendar (booking_id, spot_id, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [bookingId, spot_id, start_date, end_date || null]
    );

    res.json({
      message: "Spot reserved by admin",
      bookingId,
    });

  } catch (err) {
    console.error("❌ Reserve spot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ── SPOT MANAGEMENT ───────────────────────────────────────────────────────────

const getSpots = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const [rows] = await db.query(
      "SELECT * FROM spots ORDER BY spot_id ASC"
    );

    const filtered = rows.filter((spot) => {
      if (!spot.approval_order) return false;

      let order;

      try {
        order =
          typeof spot.approval_order === "string"
            ? JSON.parse(spot.approval_order)
            : spot.approval_order;
      } catch {
        return false;
      }

      if (!Array.isArray(order)) return false;

      // ensure numbers
      order = order.map(Number);

      return order.includes(Number(adminId));
    });

    res.json(filtered);
  } catch (err) {
    console.error("Get spots error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleSpot = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM spots WHERE spot_id = ?", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ message: "Spot not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Get spot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const createSpot = async (req, res) => {
  try {
    const { name, description, location, rules, capacity, max_booking } =
      req.body;
    if (!name)
      return res.status(400).json({ message: "Spot name is required" });

    const image1 = req.files?.["image1"]?.[0]?.filename || null;
    const image2 = req.files?.["image2"]?.[0]?.filename || null;
    const image3 = req.files?.["image3"]?.[0]?.filename || null;

    const [result] = await db.query(
      `INSERT INTO spots (name, description, location, image1, image2, image3, rules, capacity, max_booking)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        location || null,
        image1,
        image2,
        image3,
        rules || null,
        capacity || null,
        max_booking || null,
      ],
    );

    res.status(201).json({ message: "Spot created", spot_id: result.insertId });
  } catch (err) {
    console.error("Create spot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSpot = async (req, res) => {
  try {
    const { name, description, location, rules, capacity, max_booking } =
      req.body;
    const spotId = req.params.id;

    const [existing] = await db.query(
      "SELECT spot_id FROM spots WHERE spot_id = ?",
      [spotId],
    );

    if (!existing[0]) {
      return res.status(404).json({ message: "Spot not found" });
    }

    let imageUpdates = "";
    const params = [
      name,
      description || null,
      location || null,
      rules || null,
      capacity || null,
      max_booking || null,
    ];

    if (req.files?.["image1"]?.[0]) {
      imageUpdates += ", image1 = ?";
      params.push(req.files["image1"][0].filename); // ✅ FIXED
    }

    if (req.files?.["image2"]?.[0]) {
      imageUpdates += ", image2 = ?";
      params.push(req.files["image2"][0].filename); // ✅ FIXED
    }

    if (req.files?.["image3"]?.[0]) {
      imageUpdates += ", image3 = ?";
      params.push(req.files["image3"][0].filename); // ✅ FIXED
    }

    params.push(spotId);

    await db.query(
      `UPDATE spots 
       SET name = ?, description = ?, location = ?, rules = ?, capacity = ?, max_booking = ?${imageUpdates}
       WHERE spot_id = ?`,
      params,
    );

    res.json({ message: "Spot updated" });
  } catch (err) {
    console.error("Update spot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteSpot = async (req, res) => {
  try {
    const [existing] = await db.query(
      "SELECT spot_id FROM spots WHERE spot_id = ?",
      [req.params.id],
    );
    if (!existing[0])
      return res.status(404).json({ message: "Spot not found" });

    await db.query("DELETE FROM spots WHERE spot_id = ?", [req.params.id]);
    res.json({ message: "Spot deleted" });
  } catch (err) {
    console.error("Delete spot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── SPOT RECIPIENTS ───────────────────────────────────────────────────────────

const getSpotRecipients = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM approval_copy_recipients WHERE spot_id = ? ORDER BY id ASC",
      [req.params.id],
    );
    res.json(rows);
  } catch (err) {
    console.error("Get recipients error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSpotRecipients = async (req, res) => {
  try {
    const { recipients } = req.body;
    const spotId = req.params.id;

    await db.query("DELETE FROM approval_copy_recipients WHERE spot_id = ?", [
      spotId,
    ]);

    if (recipients && recipients.length > 0) {
      const values = recipients
        .filter((r) => r.recipient_email)
        .map((r) => [spotId, r.recipient_email, r.recipient_name || ""]);

      if (values.length > 0) {
        await db.query(
          "INSERT INTO approval_copy_recipients (spot_id, recipient_email, recipient_designation) VALUES ?",
          [values],
        );
      }
    }

    res.json({ message: "Recipients updated" });
  } catch (err) {
    console.error("Update recipients error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── BLOG MODERATION ───────────────────────────────────────────────────────────

const getSingleBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
 
    // 1. Main blog row
    const [blogs] = await db.query(
      `SELECT eb.blog_id, eb.blog_title, eb.summary, eb.story_details,
              eb.blog_status, eb.submitted_at, eb.published_at,
              eb.cover_image,
              u.full_name AS author,
              s.name AS spot_name,
              bk.start_date AS event_date
       FROM event_blog eb
       JOIN events ev ON eb.event_id = ev.id
       JOIN bookings bk ON ev.booking_id = bk.booking_id
       JOIN users u ON bk.user_id = u.id
       JOIN spots s ON bk.spot_id = s.spot_id
       WHERE eb.blog_id = ?`,
      [blogId]
    );
 
    if (!blogs[0]) return res.status(404).json({ message: "Blog not found" });
 
    // 2. Content blocks (schedule + images)
    const [content] = await db.query(
      `SELECT content_type, activity_time, activity_title,
              activity_description, image_path, image_caption
       FROM event_blog_content
       WHERE blog_id = ?
       ORDER BY id ASC`,
      [blogId]
    );
 
    res.json({ ...blogs[0], content });
  } catch (err) {
    console.error("Get single blog error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBlogs = async (req, res) => {
  try {
    const { status } = req.query;
    let whereClause = "";
    const params = [];
    if (status && status !== "all") {
      whereClause = "WHERE eb.blog_status = ?";
      params.push(status);
    }

    const [blogs] = await db.query(
      `SELECT eb.blog_id, eb.blog_title, eb.summary, eb.story_details,
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
       ORDER BY eb.submitted_at DESC`,
      params,
    );

    res.json(blogs);
  } catch (err) {
    console.error("Get blogs error:", err);
    res.json([]);
  }
};

const publishBlog = async (req, res) => {
  try {
    await db.query(
      "UPDATE event_blog SET blog_status = 'published' WHERE blog_id = ?",
      [req.params.id],
    );
    res.json({ message: "Blog published" });
  } catch (err) {
    console.error("Publish blog error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const rejectBlog = async (req, res) => {
  try {
    await db.query(
      "UPDATE event_blog SET blog_status = 'rejected' WHERE blog_id = ?",
      [req.params.id],
    );
    res.json({ message: "Blog rejected" });
  } catch (err) {
    console.error("Reject blog error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await db.query("DELETE FROM event_blog WHERE blog_id = ?", [req.params.id]);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("Delete blog error:", err);
    res.status(500).json({ message: "Server error" });
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
    if (!start || !end)
      return res.status(400).json({ message: "start and end dates required" });

    const [rows] = await db.query(
      `SELECT b.*, u.full_name, s.name AS spot_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN spots s ON b.spot_id = s.spot_id
       WHERE b.start_date BETWEEN ? AND ?
       ORDER BY b.start_date ASC`,
      [start, end],
    );
    res.json(rows);
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//notifications
const getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        n.notification_id,
        n.booking_id,
        n.email_subject AS type,
        n.message,
        n.is_read,
        n.created_at,
        b.title AS event_title,
        s.name AS spot_name,
        u.full_name AS user_name
      FROM notification n
      LEFT JOIN bookings b ON n.booking_id = b.booking_id
      LEFT JOIN spots s ON b.spot_id = s.spot_id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY n.created_at DESC
      LIMIT 50
    `);
    res.json(rows);
  } catch (err) {
    console.error("Get notifications error:", err);
    res.json([]);
  }
};

// MARK ALL NOTIFICATIONS as read
const markAllNotificationsRead = async (req, res) => {
  try {
    await db.query("UPDATE notification SET is_read = 1");
    res.json({ message: "All marked as read" });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// AVAILABILITY CHECK (for conflict detection in Reserve panel)
const checkSpotAvailability = async (req, res) => {
  try {
    const { id } = req.params; // spot_id
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.json({ conflict: false });

    const [rows] = await db.query(
      `
      SELECT b.booking_id, b.session, b.title, u.full_name AS organizer,
             b.booking_status
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.spot_id = ?
        AND b.booking_status IN ('approved','pending')
        AND b.start_date <= ?
        AND (b.end_date IS NULL OR b.end_date >= ?)
    `,
      [id, date, date],
    );

    if (rows.length > 0) {
      const b = rows[0];
      res.json({
        conflict: true,
        msg: `'${b.title || "An event"}' by ${b.organizer || "unknown"} is ${b.booking_status} on this date (${b.session} session).`,
      });
    } else {
      res.json({ conflict: false });
    }
  } catch (err) {
    console.error("Availability check error:", err);
    res.json({ conflict: false });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  changePassword,
  getProfile,
  updateProfile,
  updateSignature,
  dashboard,
  getAllBookings,
  getSingleBooking,
  getAdminBookingHistory,
  approveBooking,
  rejectBooking,
  reserveSpotByAdmin,
  getSpots,
  getSingleSpot,
  createSpot,
  updateSpot,
  deleteSpot,
  getSpotRecipients,
  updateSpotRecipients,
  getSingleBlog,
  getBlogs,
  publishBlog,
  rejectBlog,
  deleteBlog,
  getFeedbacks,
  getReport,
  getNotifications,
  markAllNotificationsRead,
  checkSpotAvailability,
};
