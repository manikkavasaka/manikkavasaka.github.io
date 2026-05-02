-- MK ShopZone Production Database Schema

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  business VARCHAR(255),
  budget VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image TEXT,
  category VARCHAR(100),
  tags TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  results TEXT,
  image TEXT,
  pdf_url TEXT,
  industry VARCHAR(150),
  strategy TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  review TEXT NOT NULL,
  rating INT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES leads(id),
  amount NUMERIC(10,2) NOT NULL,
  package_name VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  gateway_ref VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
