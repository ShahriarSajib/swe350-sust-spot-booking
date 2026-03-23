CREATE DATABASE IF NOT EXISTS spot_booking_system;
USE spot_booking_system;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,

    profile_picture VARCHAR(255),
    signature VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users 
ADD email_verified TINYINT(1) DEFAULT 0;
ALTER TABLE users 
ADD user_type ENUM('external','internal') NOT NULL;

CREATE TABLE tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  token VARCHAR(255),
  type VARCHAR(50),
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE spots (
    spot_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(150),

    image1 VARCHAR(255),
    image2 VARCHAR(255),
    image3 VARCHAR(255),

    spot_rules TEXT
);
CREATE TABLE approval_copy_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,

    spot_id INT NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_designation VARCHAR(150) NOT NULL,

    FOREIGN KEY (spot_id) REFERENCES spots(spot_id) ON DELETE CASCADE
);
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spot_id INT NOT NULL,
    booking_status ENUM('pending','approved','rejected','cancelled') DEFAULT 'pending',

    organizer VARCHAR(255),

    start_date DATE NOT NULL,
    end_date DATE NULL,

    session ENUM('day','night','day+night') NOT NULL,

    title VARCHAR(255),
    description TEXT,

    start_time VARCHAR(20),
    end_time VARCHAR(20),

    is_recommended BOOLEAN DEFAULT FALSE,

    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (spot_id) REFERENCES spots(spot_id)
);
CREATE TABLE availability_calendar (
    booking_id INT PRIMARY KEY,
    spot_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (spot_id) REFERENCES spots(spot_id)
);
CREATE TABLE recommendations (
    booking_id INT PRIMARY KEY,
    recommender_user_id INT NOT NULL,
    recommender_designation VARCHAR(255),
    recommended_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (recommender_user_id) REFERENCES users(id)
);
CREATE TABLE approver (
    approver_id INT AUTO_INCREMENT PRIMARY KEY,

    approver_name VARCHAR(100) NOT NULL,
    approver_email VARCHAR(100) NOT NULL,
    approver_designation VARCHAR(100),

    approver_signature VARCHAR(255)
);
CREATE TABLE approval (
    booking_id INT NOT NULL,
    approver_id INT NOT NULL,

    approvers_remarks TEXT,
    decision_time DATETIME,

    approval_copy VARCHAR(255),

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES approver(approver_id)
);
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    is_cancelled BOOLEAN DEFAULT FALSE,
    feedback TEXT,

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);
CREATE TABLE event_blog (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,

    blog_title VARCHAR(150) NOT NULL,
    summary TEXT,
    story_details TEXT,
    tags VARCHAR(150),

    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
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
CREATE TABLE payment_info (
    booking_id INT(11) NOT NULL,
    payment_info VARCHAR(250),

    FOREIGN KEY (booking_id) 
    REFERENCES bookings(booking_id) 
    ON DELETE CASCADE
);
CREATE TABLE notification (
    notification_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    booking_id INT(11) NOT NULL,

    email_subject VARCHAR(150),
    message TEXT,

    FOREIGN KEY (booking_id) 
    REFERENCES bookings(booking_id) 
    ON DELETE CASCADE
);

--modifications
ALTER TABLE approver
ADD COLUMN password VARCHAR(255) NOT NULL,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;