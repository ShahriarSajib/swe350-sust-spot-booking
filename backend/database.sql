CREATE DATABASE IF NOT EXISTS spot_booking_system;
USE spot_booking_system;
-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    signature VARCHAR(255),
    email_verified TINYINT(1) DEFAULT 0,
    user_type ENUM('external','internal') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TOKENS
CREATE TABLE tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  token VARCHAR(255),
  type VARCHAR(50),
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SPOTS (with modifications applied)
CREATE TABLE spots (
    spot_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    image1 VARCHAR(255),
    image2 VARCHAR(255),
    image3 VARCHAR(255),
    spot_rules TEXT,
    capacity INT DEFAULT NULL,
    max_booking INT DEFAULT NULL
);
ALTER TABLE spots
ADD COLUMN display_image TEXT;
ALTER TABLE spots
CHANGE spot_rules rules TEXT;
ALTER TABLE spots
ADD COLUMN approval_order JSON;
UPDATE spots
SET approval_order = JSON_ARRAY(6, 7, 8)
WHERE spot_id = 2;
-- APPROVAL COPY RECIPIENTS
CREATE TABLE approval_copy_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spot_id INT NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_designation VARCHAR(150) NOT NULL,
    FOREIGN KEY (spot_id) REFERENCES spots(spot_id) ON DELETE CASCADE
);

-- BOOKINGS (title ensured)
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spot_id INT NOT NULL,
    booking_status ENUM('pending','approved','rejected','cancelled') DEFAULT 'pending',
    organizer VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NULL,
    session ENUM('day','night','day+night') NOT NULL,
    title VARCHAR(255) DEFAULT NULL,
    description TEXT,
    start_time VARCHAR(20),
    end_time VARCHAR(20),
    is_recommended BOOLEAN DEFAULT FALSE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (spot_id) REFERENCES spots(spot_id)
);
ALTER TABLE bookings 
ADD COLUMN spot_name VARCHAR(255);
ALTER TABLE bookings
ADD COLUMN current_approval_point INT DEFAULT 0;
-- AVAILABILITY CALENDAR
CREATE TABLE availability_calendar (
    booking_id INT PRIMARY KEY,
    spot_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (spot_id) REFERENCES spots(spot_id)
);

-- RECOMMENDATIONS
CREATE TABLE recommendations (
    booking_id INT PRIMARY KEY,
    recommender_user_id INT NOT NULL,
    recommender_designation VARCHAR(255),
    recommended_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (recommender_user_id) REFERENCES users(id)
);

-- APPROVER (with modifications applied)
CREATE TABLE approver (
    approver_id INT AUTO_INCREMENT PRIMARY KEY,
    approver_name VARCHAR(100) NOT NULL,
    approver_email VARCHAR(100) NOT NULL,
    approver_designation VARCHAR(100),
    approver_signature VARCHAR(255),
    password VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- APPROVAL
CREATE TABLE approval (
    booking_id INT NOT NULL,
    approver_id INT NOT NULL,
    approvers_remarks TEXT,
    decision_time DATETIME,
    approval_copy VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES approver(approver_id)
);

-- EVENTS
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    is_cancelled BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- EVENT BLOG (with modifications applied)
CREATE TABLE event_blog (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    blog_title VARCHAR(150) NOT NULL,
    summary TEXT,
    story_details TEXT,
    tags VARCHAR(150),
    blog_status ENUM('pending','published','rejected') DEFAULT 'pending',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    cover_image VARCHAR(255),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
ALTER TABLE event_blog
DROP COLUMN tags;
ALTER TABLE event_blog
ADD COLUMN author_name VARCHAR(100);
-- EVENT BLOG CONTENT
CREATE TABLE event_blog_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT NOT NULL,
    content_type ENUM('schedule','image') NOT NULL,
    activity_time VARCHAR(50),
    activity_title VARCHAR(150),
    activity_description TEXT,
    image_path VARCHAR(255),
    image_caption VARCHAR(255),
    FOREIGN KEY (blog_id) REFERENCES event_blog(blog_id) ON DELETE CASCADE
);

-- NOTIFICATION (with modifications applied)
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NULL,
    approver_id INT NULL,
    recommender_id INT NULL,

    booking_id INT NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- FOREIGN KEYS
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES approver(approver_id) ON DELETE CASCADE,
    FOREIGN KEY (recommender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);