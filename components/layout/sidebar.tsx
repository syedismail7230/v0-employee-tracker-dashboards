'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, CheckSquare, Clock, DollarSign, BarChart3, Settings, LogOut, Menu, X, Activity, FileText } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  role: 'admin' | 'manager' | 'employee'
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/employees', label: 'Employees', icon: Users },
    { href: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/admin/attendance', label: 'Attendance', icon: Clock },
    { href: '/admin/salary', label: 'Salary Management', icon: DollarSign },
    { href: '/admin/performance', label: 'Performance', icon: BarChart3 },
    { href: '/admin/activity', label: 'Activity Evidence', icon: Activity },
    { href: '/admin/compliance', label: 'Compliance Logs', icon: FileText },
  ]

  const employeeLinks = [
    { href: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employee/tasks', label: 'My Tasks', icon: CheckSquare },
    { href: '/employee/attendance', label: 'Attendance', icon: Clock },
    { href: '/employee/leaves', label: 'Leave Requests', icon: Activity },
    { href: '/employee/salary', label: 'Salary & Deductions', icon: DollarSign },
  ]

  const links = role === 'admin' ? adminLinks : employeeLinks

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar transition-transform duration-300 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-sidebar-foreground">
              {role === 'admin' ? 'Admin Panel' : 'Employee'}
            </h1>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3',
                      isActive && 'bg-sidebar-primary text-sidebar-primary-foreground'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      <div className="md:ml-64" />
    </>
  )
}
