-- Supabase Database Schema for Business Demo App

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  hours TEXT,
  about TEXT,
  tagline TEXT,
  map_search TEXT,
  map_url TEXT,
  primary_color TEXT DEFAULT '#0ea5e9',
  accent_color TEXT DEFAULT '#06b6d4',
  services JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  social_images JSONB DEFAULT '[]'::jsonb,
  show_booking BOOLEAN DEFAULT true,
  facebook_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  category TEXT,
  address TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  status TEXT DEFAULT 'new',
  assigned_to TEXT,
  demo_url TEXT,
  short_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  built_at TIMESTAMP WITH TIME ZONE
);

-- Generated sites table (renamed from demo_sites)
CREATE TABLE generated_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  full_url TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_generated_sites_business_id ON generated_sites(business_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Row Level Security (RLS) policies (optional, enable as needed)
-- ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE generated_sites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;