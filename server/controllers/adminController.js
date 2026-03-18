const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Admin = require("../models/adminModel");

// // REGISTER
// const registerAdmin = async (req, res) => {
//   try {
//     const { name, email, designation, password } = req.body;

//     const existing = await Admin.findAdminByEmail(email);
//     if (existing) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     await Admin.createAdmin({
//       name,
//       email,
//       designation,
//       password: hashed
//     });

//     res.json({ message: "Admin registered" });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

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
  const admin = await Admin.getAdminById(req.admin.id);
  res.json(admin);
};

const updateProfile = async (req, res) => {
  await Admin.updateAdmin(req.admin.id, req.body);
  res.json({ message: "Profile updated" });
};

const dashboard = async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
      COUNT(*) total,
      SUM(booking_status='pending') pending,
      SUM(booking_status='approved') approved,
      SUM(booking_status='rejected') rejected
      FROM bookings
    `);

    const [[spots]] = await db.query(
      "SELECT COUNT(*) total_spots FROM spots"
    );

    const [recent] = await db.query(`
      SELECT b.*, u.full_name, s.name AS spot_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN spots s ON b.spot_id = s.spot_id
      ORDER BY b.timestamp DESC
      LIMIT 5
    `);

    const [pending] = await db.query(`
      SELECT b.*, u.full_name, s.name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN spots s ON b.spot_id = s.spot_id
      WHERE b.booking_status='pending'
    `);

    res.json({ stats, spots, recent, pending });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getBookings = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM bookings");
  res.json(rows);
};

const getSingleBooking = async (req, res) => {
  const [rows] = await db.query(
    `SELECT b.*, u.full_name, s.name 
     FROM bookings b
     JOIN users u ON b.user_id=u.id
     JOIN spots s ON b.spot_id=s.spot_id
     WHERE booking_id=?`,
    [req.params.id]
  );

  res.json(rows[0]);
};

const approveBooking = async (req, res) => {
  const bookingId = req.params.id;
  const adminId = req.admin.id;

  await db.query(
    `INSERT INTO approval (booking_id, approver_id, decision_time)
     VALUES (?, ?, NOW())`,
    [bookingId, adminId]
  );

  await db.query(
    `UPDATE bookings SET booking_status='approved'
     WHERE booking_id=?`,
    [bookingId]
  );

  await db.query(
    `INSERT INTO availability_calendar (booking_id, spot_id, start_date, end_date)
     SELECT booking_id, spot_id, start_date, end_date
     FROM bookings WHERE booking_id=?`,
    [bookingId]
  );

  res.json({ message: "Booking approved" });
};

const rejectBooking = async (req, res) => {
  await db.query(
    `UPDATE bookings SET booking_status='rejected'
     WHERE booking_id=?`,
    [req.params.id]
  );

  res.json({ message: "Booking rejected" });
};

const getSpots = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM spots");
  res.json(rows);
};

const createSpot = async (req, res) => {
  const { name, description, location } = req.body;

  await db.query(
    `INSERT INTO spots (name, description, location)
     VALUES (?, ?, ?)`,
    [name, description, location]
  );

  res.json({ message: "Spot created" });
};

const updateSpot = async (req, res) => {
  const { name, description, location } = req.body;

  await db.query(
    `UPDATE spots SET name=?, description=?, location=? WHERE spot_id=?`,
    [name, description, location, req.params.id]
  );

  res.json({ message: "Spot updated" });
};

const deleteSpot = async (req, res) => {
  await db.query(
    "DELETE FROM spots WHERE spot_id=?",
    [req.params.id]
  );

  res.json({ message: "Spot deleted" });
};

const getReport = async (req, res) => {
  const { start, end } = req.query;

  const [rows] = await db.query(
    `SELECT b.*, u.full_name, s.name
     FROM bookings b
     JOIN users u ON b.user_id=u.id
     JOIN spots s ON b.spot_id=s.spot_id
     WHERE b.start_date BETWEEN ? AND ?`,
    [start, end]
  );

  res.json(rows);
};

module.exports = {
  loginAdmin,
  getProfile,
  updateProfile,
  dashboard,
  getBookings,
  getSingleBooking,
  approveBooking,
  rejectBooking,
  getSpots,
  createSpot,
  updateSpot,
  deleteSpot,
  getReport
};