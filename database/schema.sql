-- MK ShopZone Professional Relational Database Schema
-- Compatible with MySQL and PostgreSQL

-- 1. Admin/Staff Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'editor', -- 'admin', 'editor'
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CRM Leads (Contact form & Audits)
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    business_name VARCHAR(255),
    service_interested VARCHAR(100),
    budget_range VARCHAR(100),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'converted', 'lost'
    source VARCHAR(100) DEFAULT 'web_form', -- 'contact', 'audit', 'popup'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CMS: Blog Posts
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category VARCHAR(100),
    tags TEXT, -- Comma separated or JSON
    meta_title VARCHAR(255),
    meta_description TEXT,
    author_id INT REFERENCES users(id),
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CMS: Case Studies / Portfolio
CREATE TABLE case_studies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    client_name VARCHAR(255),
    description TEXT,
    results_summary TEXT,
    featured_image TEXT,
    pdf_url TEXT,
    industry VARCHAR(100),
    strategy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CMS: Testimonials
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    review_text TEXT NOT NULL,
    rating INT DEFAULT 5,
    is_approved BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Newsletter Subscribers
CREATE TABLE subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'unsubscribed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
