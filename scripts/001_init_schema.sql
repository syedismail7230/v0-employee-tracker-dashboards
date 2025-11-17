-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with RBAC roles
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'employee', -- 'admin', 'manager', 'employee'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  base_salary DECIMAL(12, 2) NOT NULL DEFAULT 0,
  joining_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  department VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Attendance tracking table (30-minute intervals)
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  marked_date DATE NOT NULL,
  marked_time TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'present', 'absent', 'late', 'half_day'
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  location VARCHAR(255),
  device_info VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, marked_date, marked_time)
);

-- Tasks table for task assignment
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_by UUID NOT NULL REFERENCES public.users(id),
  assigned_to UUID NOT NULL REFERENCES public.users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'delayed', 'cancelled'
  priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  due_date TIMESTAMP NOT NULL,
  completion_date TIMESTAMP,
  estimated_hours DECIMAL(5, 2),
  actual_hours DECIMAL(5, 2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Task progress/evidence tracking
CREATE TABLE public.task_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.users(id),
  progress_percentage INT DEFAULT 0,
  description TEXT,
  attachment_url VARCHAR(500),
  screenshot_url VARCHAR(500),
  logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance targets table
CREATE TABLE public.performance_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_name VARCHAR(255) NOT NULL,
  target_value DECIMAL(10, 2) NOT NULL,
  current_value DECIMAL(10, 2) DEFAULT 0,
  metric_type VARCHAR(100), -- 'tasks_completed', 'productivity_score', 'attendance_percentage'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'achieved', 'failed'
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Attendance-based salary deductions
CREATE TABLE public.salary_deductions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  deduction_type VARCHAR(50) NOT NULL, -- 'missed_attendance', 'task_delay', 'other'
  amount DECIMAL(12, 2) NOT NULL,
  reason TEXT,
  deduction_date DATE NOT NULL,
  is_auto_deducted BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Leave requests
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL, -- 'full_day', 'half_day', 'hourly'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  hours_requested DECIMAL(5, 2),
  reason TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID REFERENCES public.users(id),
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

-- Activity logs for evidence collection
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL, -- 'app_usage', 'file_access', 'login', 'logout'
  description TEXT,
  metadata JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Escalation workflow
CREATE TABLE public.escalations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES public.tasks(id),
  employee_id UUID NOT NULL REFERENCES public.users(id),
  escalation_reason VARCHAR(255),
  escalation_level INT DEFAULT 1, -- 1: manager, 2: admin
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'resolved', 'closed'
  assigned_to UUID REFERENCES public.users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Compliance log for audit trail
CREATE TABLE public.compliance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100), -- 'task', 'attendance', 'salary', 'leave'
  entity_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Productivity heatmap data
CREATE TABLE public.productivity_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  hour_of_day INT, -- 0-23
  productivity_score DECIMAL(5, 2), -- 0-100
  tasks_completed INT DEFAULT 0,
  active_duration_minutes INT DEFAULT 0,
  break_duration_minutes INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, metric_date, hour_of_day)
);

-- Timesheet records (automated)
CREATE TABLE public.timesheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  timesheet_date DATE NOT NULL,
  clock_in_time TIMESTAMP,
  clock_out_time TIMESTAMP,
  break_duration_minutes INT DEFAULT 0,
  total_hours DECIMAL(5, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'submitted', 'approved', 'rejected'
  submitted_by UUID REFERENCES public.users(id),
  approved_by UUID REFERENCES public.users(id),
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, timesheet_date)
);

-- Create indexes for better query performance
CREATE INDEX idx_attendance_employee ON public.attendance_records(employee_id, marked_date);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to, status);
CREATE INDEX idx_tasks_assigned_by ON public.tasks(assigned_by);
CREATE INDEX idx_salary_deductions_employee ON public.salary_deductions(employee_id, deduction_date);
CREATE INDEX idx_leave_requests_employee ON public.leave_requests(employee_id, start_date);
CREATE INDEX idx_activity_logs_employee ON public.activity_logs(employee_id, timestamp);
CREATE INDEX idx_compliance_logs_user ON public.compliance_logs(user_id, created_at);
CREATE INDEX idx_productivity_metrics ON public.productivity_metrics(employee_id, metric_date);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productivity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;
