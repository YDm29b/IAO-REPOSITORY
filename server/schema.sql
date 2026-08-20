-- IST Astronomical Observatory (IAO) - PostgreSQL / Supabase Production Database Schema
-- Execute this script in your production PostgreSQL or Supabase SQL Editor

-- 1. System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id INT PRIMARY KEY DEFAULT 1,
  bookings_open BOOLEAN NOT NULL DEFAULT TRUE,
  payment_required BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT single_row_check CHECK (id = 1)
);

INSERT INTO system_settings (id, bookings_open, payment_required)
VALUES (1, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- 3. Observation Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY,
  booking_reference VARCHAR(32) UNIQUE NOT NULL,
  customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  slot_id INT NOT NULL,
  slot_time VARCHAR(64) NOT NULL,
  session_type VARCHAR(16) NOT NULL CHECK (session_type IN ('solar', 'night')),
  number_of_people INT NOT NULL CHECK (number_of_people BETWEEN 1 AND 5),
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('CONFIRMED', 'PENDING_PAYMENT', 'CANCELLED')),
  payment_status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
  payment_id VARCHAR(128),
  amount_paid NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_date_slot ON bookings(date, slot_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);

-- 4. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'UNSUBSCRIBED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- 5. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
