-- Visa Requests Table
CREATE TABLE IF NOT EXISTS visa_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination_country VARCHAR(100) NOT NULL,
    travel_purpose ENUM('tourism', 'business', 'education', 'medical', 'family', 'other') NOT NULL,
    intended_travel_date DATE NOT NULL,
    passport_number VARCHAR(50) NOT NULL,
    document_path VARCHAR(255) NULL,
    status ENUM('submitted', 'under_review', 'approved', 'rejected') DEFAULT 'submitted',
    admin_comments TEXT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tblusers(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- Insert sample data
INSERT INTO visa_requests (user_id, destination_country, travel_purpose, intended_travel_date, passport_number, status, admin_comments) VALUES
(1, 'United States', 'tourism', '2024-06-15', 'A12345678', 'under_review', 'Documents received. Processing in progress.'),
(1, 'United Kingdom', 'business', '2024-08-20', 'A12345678', 'approved', 'Application approved. Please proceed with embassy appointment.'),
(2, 'Canada', 'education', '2024-09-01', 'B87654321', 'submitted', NULL),
(3, 'Germany', 'medical', '2024-07-10', 'C11223344', 'rejected', 'Insufficient documentation provided. Please resubmit with complete medical records.');