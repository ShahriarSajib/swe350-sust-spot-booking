

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

    -- Foreign Keys
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