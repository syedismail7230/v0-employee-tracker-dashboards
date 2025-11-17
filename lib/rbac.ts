export type Permission = 
  | 'view_dashboard'
  | 'manage_employees'
  | 'assign_tasks'
  | 'view_all_tasks'
  | 'manage_attendance'
  | 'manage_salary'
  | 'view_performance'
  | 'approve_leaves'
  | 'manage_targets'
  | 'view_own_data'
  | 'submit_attendance'
  | 'request_leave'
  | 'view_own_salary'

export const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'view_dashboard',
    'manage_employees',
    'assign_tasks',
    'view_all_tasks',
    'manage_attendance',
    'manage_salary',
    'view_performance',
    'approve_leaves',
    'manage_targets',
    'view_own_data',
  ],
  manager: [
    'view_dashboard',
    'assign_tasks',
    'view_all_tasks',
    'manage_attendance',
    'view_performance',
    'approve_leaves',
    'manage_targets',
    'view_own_data',
  ],
  employee: [
    'view_own_data',
    'submit_attendance',
    'request_leave',
    'view_own_salary',
  ],
}

export const hasPermission = (role: string, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false
}
