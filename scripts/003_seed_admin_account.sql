-- Create the super admin account
-- Email: admin@zawrindustries.com
-- Password: Zawr@2009$$

-- First, delete any existing admin account with this email
DELETE FROM users WHERE email = 'admin@zawrindustries.com';

-- Insert the admin account with hashed password
-- Password hash for "Zawr@2009$$" using bcrypt
INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  role,
  status,
  department,
  base_salary,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@zawrindustries.com',
  '$2a$10$YourHashedPasswordHere', -- This will be replaced by actual bcrypt hash
  'System Administrator',
  'admin',
  'active',
  'Management',
  0.00,
  NOW(),
  NOW()
);

-- Note: The password hash above is a placeholder. 
-- The actual hash will be generated when a user is created through the signup API
-- For now, we'll handle this in the application code
