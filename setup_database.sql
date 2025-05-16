-- Create database if not exists
CREATE DATABASE IF NOT EXISTS mannabay_foundation_db;
USE mannabay_foundation_db;

-- Create wards table
CREATE TABLE IF NOT EXISTS wards (
    ward_id INT PRIMARY KEY AUTO_INCREMENT,
    ward_name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL,
    description TEXT,
    manager_id INT,
    staff_count INT DEFAULT 0
);

-- Create ranks table
CREATE TABLE IF NOT EXISTS ranks (
    rank_id INT PRIMARY KEY AUTO_INCREMENT,
    rank_name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    national_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    ward_id INT,
    address TEXT,
    dept_id INT,
    rank_id INT,
    employment_date DATE NOT NULL,
    salary DECIMAL(10,2),
    status ENUM('Active', 'On Leave', 'Suspended', 'Terminated') DEFAULT 'Active',
    photo_path VARCHAR(255),
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id),
    FOREIGN KEY (rank_id) REFERENCES ranks(rank_id)
);

-- Insert sample data for wards
INSERT INTO wards (ward_name) VALUES 
('Bahati'),
('Kiamaina'),
('Dundori'),
('Lanet'),
('Kabatini');

-- Insert sample data for departments
INSERT INTO departments (dept_name) VALUES 
('Administration'),
('Programs'),
('Finance'),
('Human Resources'),
('Operations'),
('Monitoring & Evaluation');

-- Insert sample data for ranks
INSERT INTO ranks (rank_name) VALUES 
('Executive Director'),
('Program Manager'),
('Finance Manager'),
('HR Manager'),
('Field Officer'),
('Accountant'),
('Administrative Assistant');
