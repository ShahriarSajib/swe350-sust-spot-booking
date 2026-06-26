# 🏛️ SUST Spot Booking Platform

A full‑stack web application for **booking on‑campus spots** at **Shahjalal University of Science and Technology (SUST)**. The platform streamlines venue reservations, multi‑step approvals, event management, blog publishing, and real‑time notifications — serving both **internal** (students, faculty) and **external** users.

> **Live Demo:** [sust-spot-booking.vercel.app](https://sust-spot-booking.vercel.app/)  
> **GitHub Repository:** [github.com/mohaiminulnirob/swe350-sust-spot-booking](https://github.com/mohaiminulnirob/swe350-sust-spot-booking)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture & Role-Based Workflows](#-system-architecture-role-based-workflows)
- [Project Structure](#-project-structure)
- [Frontend Pages](#-frontend-pages)
- [Backend API Reference](#-backend-api-reference)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👤 User Features
- **Dual Registration** — Internal users (`@sust.edu`) and external users (with ID upload)
- **Email Verification** — Secure email verification before login
- **Password Management** — Forgot/reset password flow with email tokens
- **Profile Management** — Update personal info, upload profile picture & signature
- **Spot Browsing** — View all bookable venues with images, capacity, rules & location
- **Availability Calendar** — Real‑time color‑coded calendar (red = fully booked, yellow = partial, teal = pending)
- **Single / Multi‑day Booking** — Book a single day or a date range with session selection (Day / Night / Full Day)
- **Recommendation Gate** — Bookings require a faculty/authority recommendation before entering approval
- **Multi‑step Approval** — Configurable sequential approval chain per spot
- **PDF Approval Copies** — Generate formatted approval documents with digital signatures
- **Event Dashboard** — View upcoming, pending, past, cancelled & rejected events
- **Blog Publishing** — Create rich event blogs with galleries, schedules, and cover images
- **Feedback Submission** — Submit feedback for completed events
- **Real‑time Notifications** — Bell icon with unread badge, polling every 15 seconds
- **PDF Reports** — Generate booking reports via `jspdf`

### 🔐 Admin Features
- **Admin Authentication** — Dedicated admin login with JWT (7‑day expiry)
- **Dashboard Analytics** — Total, pending, approved & rejected bookings at a glance
- **Spot Management** — Full CRUD for venues (name, location, capacity, images, rules)
- **Approval Copy Recipients** — Configure per‑spot email recipients for approval copies
- **Sequential Approval Flow** — Approve/reject bookings step‑by‑step with remarks
- **Admin Reservation** — Reserve spots on behalf of users (auto‑cancels conflicting bookings)
- **Blog Moderation** — Review, publish, or reject submitted event blogs
- **Booking History** — Full searchable/sortable booking archive
- **Notification Center** — Admin‑specific notification panel
- **Feedback Review** — View all event feedback in one place
- **Report Generation** — Download booking reports for date ranges

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **React Router DOM 7** | Client‑side routing |
| **Tailwind CSS 4** | Utility‑first styling |
| **Axios** | HTTP client |
| **date‑fns** | Date manipulation |
| **react‑day‑picker** | Calendar widget |
| **lucide‑react** | Icon library |
| **jspdf + jspdf‑autotable + html2canvas** | PDF generation |
| **react‑datepicker** | Date picker component |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express 5** | Web framework |
| **MySQL 2** | Database driver (promise‑based pool) |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT authentication |
| **Multer** | File uploads (profile pics, signatures, spot images, blog media) |
| **Nodemailer** | Email sending (verification, password reset, booking notifications) |
| **cors** | Cross‑origin resource sharing |
| **dotenv** | Environment variable management |

### Database
| Component | Detail |
|---|---|
| **Database** | MySQL |
| **Connection** | Connection pool via `mysql2/promise` |
| **Tables** | `users`, `spots`, `bookings`, `approver`, `approval`, `recommendations`, `availability_calendar`, `events`, `event_blog`, `event_blog_content`, `notifications`, `tokens`, `approval_copy_recipients` |

---

## 🔄 System Architecture & Role-Based Workflows

### 🧑‍🎓 Internal User Workflow

```
Internal User ──► Register (@sust.edu) ──► Email Verification ──► Login (JWT)
       │
       ├──► Browse Spots (all 5 venues available)
       │
       ├──► Check Availability Calendar ──► Select Date & Session
       │                                        (Day / Night / Full Day)
       │
       ├──► Submit Booking ──► Recommendation Request sent to Faculty
       │                                    │
       │                            Faculty Recommends ✅
       │                                    │
       │                        ┌─── Approval Pipeline ───┐
       │                        │   (multi‑step, sequential) │
       │                        │  Approver 1 ──► Approver 2 │
       │                        │  ──► … ──► Approved ✅     │
       │                        └─────────────────────────────┘
       │                                    │
       │                              Event Confirmed
       │                                    │
       ├──► Event Dashboard ──► View Upcoming / Pending / Past Events
       │         │
       │         ├──► Submit Feedback
       │         └──► Publish Blog ──► Admin Moderation ──► Published
       │
       └──► Manage Profile ──► Update Photo, Signature, Password
```

### 🧑‍💼 External User Workflow

```
External User ──► Register (with ID upload) ──► Email Verification ──► Login (JWT)
       │
       ├──► Browse Spots (only Central Auditorium available)
       │
       ├──► Check Availability Calendar ──► Select Date & Session
       │
       ├──► Submit Booking ──► Recommendation Request sent to Faculty
       │                                    │
       │                            Faculty Recommends ✅
       │                                    │
       │                        ┌─── External Approval Pipeline ──┐
       │                        │  (external_approval_order JSON) │
       │                        │  Approver 1 ──► Approver 2 …   │
       │                        │  ──► Approved ✅                │
       │                        └─────────────────────────────────┘
       │                                    │
       │                              Event Confirmed
       │
       ├──► Event Dashboard ──► View Events
       │
       └──► Manage Profile ──► Update Photo, Signature
```

### 🔐 Admin Workflow

```
Admin (Approver) ──► Login (dedicated admin portal)
       │
       ├──► Dashboard Overview
       │     ├──► View Stats (Total / Pending / Approved / Rejected)
       │     └──► View Upcoming Events
       │
       ├──► Spot Management
       │     ├──► Create / Edit / Delete Spots
       │     ├──► Upload Spot Images & Rules
       │     └──► Configure Approval Copy Recipients
       │
       ├──► Booking Approvals
       │     ├──► View Recommended Bookings
       │     ├──► Approve (forward to next approver or finalize)
       │     └──► Reject with Remarks
       │
       ├──► Admin Reservation
       │     └──► Reserve Spot on behalf of user (auto‑cancel conflicts)
       │
       ├──► Blog Moderation
       │     ├──► Review Submitted Blogs
       │     ├──► Publish ✅ or Reject ❌
       │     └──► Delete Inappropriate Content
       │
       ├──► Booking History
       │     └──► Search / Filter / Sort archived bookings
       │
       ├──► Reports
       │     └──► Download booking report for a date range
       │
       └──► Profile Management
             ├──► Update Name, Designation, Email
             ├──► Upload Signature
             └──► Change Password
```

### 📋 Cross‑Role Booking Lifecycle Summary

| Step | Description | Roles Involved |
|---|---|---|
| 1 | User registers & verifies email | Internal / External |
| 2 | User browses spots & checks availability | Internal / External |
| 3 | User submits booking → `pending` status | Internal / External |
| 4 | Faculty marks as recommended | Recommender |
| 5 | Admin approves through sequential chain | Approver(s) |
| 6 | Booking finalized → `approved` event | System |
| 7 | Event appears in user dashboard | Internal / External |
| 8 | User submits feedback & publishes blog | Internal / External |
| 9 | Admin moderates & publishes blog | Admin |

---

## 📁 Project Structure

```
swe350-sust-spot-booking/
├── package.json              # Root monorepo orchestration
├── backend/
│   ├── server.js             # Express entry point
│   ├── database.sql          # Full MySQL schema
│   ├── config/
│   │   └── db.js             # MySQL connection pool
│   ├── controllers/          # Route handlers
│   │   ├── adminController.js
│   │   ├── approverController.js
│   │   ├── availabilityCalenderController.js
│   │   ├── blogController.js
│   │   ├── bookingController.js
│   │   ├── eventController.js
│   │   ├── notificationController.js
│   │   ├── recommendationController.js
│   │   ├── spotController.js
│   │   └── userController.js
│   ├── models/               # Raw SQL query functions
│   ├── routes/               # Express route definitions
│   ├── middlewares/           # Auth, upload middleware
│   ├── services/             # Business logic layer
│   ├── utils/                # Helpers (mailer, file helper)
│   └── uploads/              # Stored images
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx          # React entry (BrowserRouter)
│       ├── App.jsx           # Routing & auth gating
│       ├── assets/           # Static images (35 files)
│       ├── components/       # Shared UI components
│       │   ├── authentication/
│       │   │   └── AnimatedSpotShowcase.jsx
│       │   ├── Header/
│       │   ├── Footer/
│       │   ├── sections/
│       │   │   ├── AnimeSection.jsx          # Hero banner
│       │   │   ├── PreferredSpotSection.jsx  # Spot grid
│       │   │   ├── UpcomingEventsSection.jsx
│       │   │   └── FeaturedEventsSection.jsx
│       │   ├── SpotDetailsComponent/
│       │   │   ├── BookingCalender.jsx
│       │   │   ├── BookingForm.jsx
│       │   │   ├── SpotInformations.jsx
│       │   │   └── GalleryModal.jsx
│       │   └── profile_components/
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── ExternalRegister.jsx
│       │   │   └── ResetPassword.jsx
│       │   ├── admin/fields/
│       │   │   ├── DashboardOverview.jsx
│       │   │   ├── SpotManagement.jsx
│       │   │   ├── BookingApprovals.jsx
│       │   │   ├── BookingHistory.jsx
│       │   │   ├── BlogModeration.jsx
│       │   │   ├── ReserveSpotPanel.jsx
│       │   │   ├── AdminHeader.jsx
│       │   │   ├── NotificationsModal.jsx
│       │   │   ├── adminApi.js
│       │   │   └── Toast.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── SpotDetails.jsx
│       │   ├── FeaturedEventsBlog.jsx
│       │   ├── BlogDetail.jsx
│       │   ├── UserNotifications.jsx
│       │   └── InfoPage.jsx
│       └── index.css         # Tailwind imports + calendar styles
```

---

## 🖼 Frontend Pages

| Page | Route | Description |
|---|---|---|
| **Login** | `/login` | User/Admin login with forgot‑password toggle, field‑level error highlighting |
| **Register (Internal)** | `/register` | Registration for `@sust.edu` users |
| **Register (External)** | `/external-booking` | External user registration with ID upload |
| **Reset Password** | `/reset-password/:token` | Password reset form |
| **Home** | `/` | Hero banner, preferred spots grid, upcoming events, featured blogs |
| **Spot Details & Booking** | `/spot/:id` | Spot info, image gallery, availability calendar, booking form |
| **Profile & Events** | `/profile` | Sidebar (edit profile, upload sig), tabbed dashboard (events, recommendations, blogs) |
| **Featured Blogs** | `/featured-events` | Filterable blog list with search, spot & date filters |
| **Blog Detail** | `/blog/:id` | Full blog with schedule, gallery, and story details |
| **Notifications** | (modal) | User notification panel with read/unread management |
| **Admin Dashboard** | `/admin-dashboard` | Stats, spot CRUD, booking approvals, history, blog moderation, reports |

### Key UI Components

| Component | Purpose |
|---|---|
| **AnimatedSpotShowcase** | Animated sidebar illustration on auth pages |
| **AnimeSection** | Hero/welcome banner with quick‑booking form |
| **PreferredSpotSection** | 5‑card spot grid with role‑based visibility |
| **UpcomingEventsSection** | Live events feed fetched from API |
| **BookingCalender** | Interactive `react‑day-picker` with day/night/full/pending color coding |
| **BookingForm** | Recommender selection, personal details, event info |
| **ApprovalModal** | Multi‑step approval copy preview with signatures |
| **EventCard** | Unified event card with status badges and action buttons |
| **GalleryModal** | Fullscreen image gallery lightbox |
| **ProfileSidebar** | Editable profile fields + signature upload |
| **ReserveSpotPanel** | Admin spot reservation with conflict detection & auto‑cancel |

---

## 📡 Backend API Reference

### Authentication & Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users/internal` | — | Register internal user (`@sust.edu`) |
| `POST` | `/api/users/external` | — | Register external user (with ID file) |
| `POST` | `/api/users/login` | — | Login → returns JWT (1d expiry) |
| `GET` | `/api/users/verify/:token` | — | Email verification |
| `GET` | `/api/users/profile/:id` | JWT | Get user profile |
| `PUT` | `/api/users/profile/:id` | JWT | Update profile (name, dept, contact, photo, sig) |
| `POST` | `/api/users/forgot-password` | — | Request password reset email |
| `POST` | `/api/users/reset-password/:token` | — | Reset password with token |
| `POST` | `/api/users/change-password` | JWT | Change password (requires current password) |

### Spots (`/api/spots`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/spots/:id` | — | Get spot by ID |
| `GET` | `/api/spots/details/:name` | — | Get spot details by name |
| `POST` | `/api/spots/add-rules` | — | Add rules to an existing spot |

### Availability (`/api/availability`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/availability/:spotId` | — | Get all booked dates with day/night/full/pending status |

### Bookings (`/api/bookings`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/bookings/confirm` | — | Create new booking (with recommender) |
| `GET` | `/api/bookings/user-events/:id` | JWT | Get all user events (upcoming, pending, past, cancelled, rejected) |
| `PATCH` | `/api/bookings/cancel/:bookingId` | — | Cancel a booking |

### Events (`/api/events`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/events/upcoming` | — | Get all upcoming approved events |
| `POST` | `/api/events/feedback` | — | Submit feedback for an event |

### Blog (`/api/blog`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/blog/create` | — | Create blog (title, summary, story, cover, gallery, schedule) |
| `GET` | `/api/blog/all` | — | Get all published blogs |
| `GET` | `/api/blog/user/:userId` | — | Get blogs for a specific user |

### Recommendations (`/api/recommendations`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/recommendations/user/:id` | JWT | Get bookings awaiting recommendation |
| `PUT` | `/api/recommendations/mark/:bookingId` | JWT | Mark booking as recommended (enters approval pipeline) |

### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | JWT | Get user notifications |
| `GET` | `/api/notifications/unread-count` | JWT | Get unread notification count |
| `PUT` | `/api/notifications/:id/read` | JWT | Mark single notification as read |
| `PUT` | `/api/notifications/read-all` | JWT | Mark all as read |

### Admin (`/api/admin`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/admin/login` | — | Admin login (plain‑text password check → JWT, 7d) |
| `GET` | `/api/admin/dashboard` | Admin | Dashboard stats & upcoming events |
| `GET` | `/api/admin/bookings` | Admin | Recommended bookings (filtered by admin) |
| `GET` | `/api/admin/bookings/history` | Admin | Booking history |
| `GET` | `/api/admin/bookings/:id` | Admin | Single booking details |
| `POST` | `/api/admin/bookings/:id/approve` | Admin | Approve (forward to next approver or finalize) |
| `POST` | `/api/admin/bookings/:id/reject` | Admin | Reject with reason |
| `POST` | `/api/admin/bookings/reserve` | Admin | Admin‑reserved spot (conflict auto‑cancel) |
| `GET/POST/PUT/DELETE` | `/api/admin/spots[/:id]` | Admin | Full spot CRUD |
| `GET/PUT` | `/api/admin/spots/:id/recipients` | Admin | Manage approval copy recipients |
| `GET` | `/api/admin/spots/:id/availability` | Admin | Check spot availability for a date |
| `GET` | `/api/admin/blogs` | Admin | List all blogs (with status filter) |
| `POST` | `/api/admin/blogs/:id/publish` | Admin | Publish a pending blog |
| `POST` | `/api/admin/blogs/:id/reject` | Admin | Reject a blog |
| `DELETE` | `/api/admin/blogs/:id` | Admin | Delete a blog |
| `GET` | `/api/admin/feedbacks` | Admin | View all feedback |
| `GET` | `/api/admin/report` | Admin | Download report for date range |
| `GET/PUT` | `/api/admin/profile` | Admin | Get/update admin profile |
| `POST` | `/api/admin/profile/signature` | Admin | Upload admin signature |
| `PUT` | `/api/admin/change-password` | Admin | Change admin password |

### Admin Notifications (`/api/admin/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/notifications` | Admin | Get admin notifications |
| `GET` | `/api/admin/notifications/unread-count` | Admin | Get unread count |
| `PUT` | `/api/admin/notifications/:id/read` | Admin | Mark as read |
| `PUT` | `/api/admin/notifications/read-all` | Admin | Mark all as read |

### Approver Details (`/api/approver`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/approver/details/:spot_id` | — | Get approval rules & approver list for a spot |

---

## 🗄 Database Schema

The database `spot_booking_system` contains **12 tables**:

| Table | Key Purpose |
|---|---|
| `users` | Internal & external users (name, email, password hash, user_type, profile, signature) |
| `spots` | Venues (name, location, capacity, images, rules, approval_order JSON) |
| `bookings` | Booking records (user, spot, dates, session, status, approval point) |
| `availability_calendar` | Tracks booked date ranges per spot |
| `recommendations` | Links bookings to recommender (faculty) |
| `approver` | Admin/approver accounts (name, email, designation, signature, password) |
| `approval` | Multi‑step approval records (remarks, timestamps, copy file) |
| `events` | Approved bookings turned into events |
| `event_blog` | Blog posts (title, summary, story, status, cover image) |
| `event_blog_content` | Blog schedules & gallery images |
| `notifications` | User & admin notifications (title, message, is_read) |
| `tokens` | Email verification & password reset tokens |
| `approval_copy_recipients` | Per‑spot email recipients for approval copies |

> Full DDL: `backend/database.sql`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MySQL** 8+
- **npm** v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/mohaiminulnirob/swe350-sust-spot-booking.git
cd swe350-sust-spot-booking

# Install all dependencies (root + backend + frontend)
npm run install-all

# Set up the database
mysql -u root -p < backend/database.sql

# Configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials & SMTP settings

# Start development (backend + frontend concurrently)
npm run dev
```

If you installed the root `node_modules` with `npm install` (which also installs frontend/backend dependencies), then:

```bash
npm run dev
```

This will start:
- **Backend** on `http://localhost:5000` (with nodemon)
- **Frontend** on `http://localhost:5173`

### Individual Start

```bash
# Backend only
npm run server

# Frontend only
npm run client
```

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=spot_booking_system

JWT_SECRET=your_jwt_secret_key
BASE_URL=http://localhost:5000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="spot-booking <no-reply@sust.local>"
```

---

## 🗺 Future Roadmap

- [ ] **Docker Compose** — Containerized deployment
- [ ] **CI/CD Pipeline** — Automated testing & deployment
- [ ] **Unit & Integration Tests** — Vitest / Jest for backend & frontend
- [ ] **Rate Limiting** — Prevent abuse on auth & booking endpoints
- [ ] **Input Sanitization** — Enhanced XSS & SQL injection protection
- [ ] **WebSocket / SSE** — Real‑time notification push (replace polling)
- [ ] **Admin Roles** — Super admin, moderator, viewer permissions
- [ ] **Payment Gateway** — Paid booking for external users
- [ ] **Email Templates** — Rich HTML email designs
- [ ] **Dark Mode** — Theme toggle
- [ ] **Mobile App** — React Native / Flutter companion
- [ ] **iCalendar Export** — Add events to Google Calendar / Outlook
- [ ] **Internationalization (i18n)** — Multi‑language support
- [ ] **Audit Logging** — Admin action history trail
- [ ] **SMS Notifications** — Twilio integration for booking alerts

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is developed as part of the **SWE 350** course at SUST.  
Distributed under the ISC License.

---

## 👥 Contributors

- **Mohaiminul Nirob** — [GitHub](https://github.com/mohaiminulnirob)
- **Sadia Nusrat Munny** — [GitHub](https://github.com/sadianusratmunny51)
- **Md.Sajib Hossen** — [GitHub](https://github.com/ShahriarSajib)

---

<p align="center">
  <strong>SUST Spot Booking</strong> — Making campus venue booking seamless, transparent, and efficient. 🎯
</p>
