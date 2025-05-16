-- Database creation
CREATE DATABASE IF NOT EXISTS mannabay_foundation_db;
USE mannabay_foundation_db;

-- Table for wards
CREATE TABLE wards (
    ward_id INT AUTO_INCREMENT PRIMARY KEY,
    ward_name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for departments
CREATE TABLE departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for staff ranks/positions
CREATE TABLE ranks (
    rank_id INT AUTO_INCREMENT PRIMARY KEY,
    rank_name VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for staff members
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    national_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    ward_id INT,
    address TEXT,
    dept_id INT,
    rank_id INT,
    employment_date DATE NOT NULL,
    salary DECIMAL(12,2),
    status ENUM('Active', 'On Leave', 'Suspended', 'Terminated') DEFAULT 'Active',
    photo_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id),
    FOREIGN KEY (rank_id) REFERENCES ranks(rank_id)
);

-- Table for users (admin panel access)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('Super Admin', 'Admin', 'Manager', 'Staff') NOT NULL,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

-- Table for staff documents
CREATE TABLE staff_documents (
    doc_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_number VARCHAR(100),
    file_path VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

-- Table for leave records
CREATE TABLE leave_records (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    leave_type ENUM('Annual', 'Sick', 'Maternity', 'Paternity', 'Compassionate', 'Study', 'Other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested INT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    reason TEXT,
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (approved_by) REFERENCES staff(staff_id)
);

-- Table for performance reviews
CREATE TABLE performance_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    reviewed_by INT NOT NULL,
    review_date DATE NOT NULL,
    performance_score DECIMAL(3,1),
    strengths TEXT,
    areas_for_improvement TEXT,
    recommendations TEXT,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (reviewed_by) REFERENCES staff(staff_id)
);

-- Insert initial ward data
INSERT INTO wards (ward_name, description) VALUES
('Bahati', 'Bahati Ward in Bahati Subcounty'),
('Kiamaina', 'Kiamaina Ward where main office is located'),
('Dundori', 'Dundori Ward in Bahati Constituency'),
('Lanet', 'Lanet Ward in Bahati Constituency'),
('Kabatini', 'Kabatini Ward in Bahati Constituency');

-- Insert sample departments
INSERT INTO departments (dept_name, description) VALUES
('Administration', 'Handles foundation administration and management'),
('Programs', 'Manages community programs and initiatives'),
('Finance', 'Handles all financial matters'),
('Human Resources', 'Manages staff and volunteers'),
('Operations', 'Daily operations and logistics'),
('Monitoring & Evaluation', 'Tracks program effectiveness');

-- Insert sample ranks
INSERT INTO ranks (rank_name, level, description) VALUES
('Executive Director', 1, 'Overall foundation leader'),
('Program Manager', 2, 'Manages specific programs'),
('Finance Manager', 2, 'Head of finance department'),
('HR Manager', 2, 'Head of human resources'),
('Field Officer', 3, 'Implements programs in the field'),
('Accountant', 3, 'Handles financial records'),
('Administrative Assistant', 4, 'Provides administrative support'),
('Driver', 5, 'Provides transportation services'),
('Cleaner', 6, 'Maintains office cleanliness');