-- Clear all demo/test data from tables
DELETE FROM public.timesheets;
DELETE FROM public.productivity_metrics;
DELETE FROM public.compliance_logs;
DELETE FROM public.escalations;
DELETE FROM public.activity_logs;
DELETE FROM public.leave_requests;
DELETE FROM public.salary_deductions;
DELETE FROM public.performance_targets;
DELETE FROM public.task_evidence;
DELETE FROM public.tasks;
DELETE FROM public.attendance_records;
DELETE FROM public.notifications;
DELETE FROM public.users WHERE role = 'employee' OR role = 'manager';

-- Reset sequences if needed
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;

COMMIT;
