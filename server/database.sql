CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(255) NOT NULL,
    user_type ENUM('internal','external') NOT NULL,

    department VARCHAR(100),
    organization VARCHAR(255),
    designation VARCHAR(100),

    email VARCHAR(255) NOT NULL UNIQUE,
    contact_number VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,

    id_file VARCHAR(255),
    profile_picture VARCHAR(255),
    signature VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE spots (
    spot_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(150),

    display_image TEXT,
    approval_copy_recipient TEXT
);
CREATE TABLE spot_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,

    spot_id INT,
    rules TEXT,

    FOREIGN KEY (spot_id) REFERENCES spots(spot_id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spot_id INT NOT NULL,

    booking_type ENUM('external','internal') NOT NULL,
    booking_status ENUM('pending','approved','rejected','cancelled') DEFAULT 'pending',

    organizer VARCHAR(255),

    start_date DATE NOT NULL,
    end_date DATE NULL,

    session ENUM('day','night','day+night') NOT NULL,

    title VARCHAR(255),
    description TEXT,

    spot_name VARCHAR(255),

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