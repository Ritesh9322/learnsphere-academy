import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import LogoutDialog from '@/components/LogoutDialog';
import {
  LayoutDashboard, BookOpen, FileText, ClipboardList, Users, BarChart3,
  CreditCard, Bell, User, LogOut, Menu, X, GraduationCap, Settings,
  ChevronRight, CalendarDays, Award, TrendingUp, ShieldCheck
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/student' },
  { label: 'My Courses', icon: BookOpen, path: '/student/courses' },
  { label: 'Assignments', icon: FileText, path: '/student/assignments' },
  { label: 'Quizzes', icon: ClipboardList, path: '/student/quizzes' },
  { label: 'Attendance', icon: CalendarDays, path: '/student/attendance' },
  { label: 'Grades', icon: Award, path: '/student/grades' },
  { label: 'Payments', icon: CreditCard, path: '/student/payments' },
  { label: 'Profile', icon: User, path: '/student/profile' },
];

const teacherNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
  { label: 'My Courses', icon: BookOpen, path: '/teacher/courses' },
  { label: 'Assignments', icon: FileText, path: '/teacher/assignments' },
  { label: 'Quizzes', icon: ClipboardList, path: '/teacher/quizzes' },
  { label: 'Attendance', icon: CalendarDays, path: '/teacher/attendance' },
  { label: 'Students', icon: Users, path: '/teacher/students' },
  { label: 'Analytics', icon: TrendingUp, path: '/teacher/analytics' },
  { label: 'Profile', icon: User, path: '/teacher/profile' },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Courses', icon: BookOpen, path: '/admin/courses' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
  { label: 'Security', icon: ShieldCheck, path: '/admin/security' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

function SidebarContent({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const nav = user?.role === 'admin' ? adminNav : user?.role === 'teacher' ? teacherNav : studentNav;
  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'teacher' ? 'Instructor' : 'Student';
  const roleBadgeStyle = user?.role === 'admin' ? 'badge-info' : user?.role === 'teacher' ? 'badge-warning' : 'badge-success';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="h-full flex flex-col" style={{ background: 'hsl(var(--sidebar-background))' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-white font-display font-bold text-base leading-tight">OneAcademy</div>
            <div className="text-xs" style={{ color: 'hsl(var(--sidebar-foreground) / 0.5)' }}>Learning Platform</div>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="text-sidebar-foreground/60 hover:text-sidebar-foreground ml-auto">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/40">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
              <span className={roleBadgeStyle}>{roleLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} onClick={onClose}
              className={`nav-item ${active ? 'active' : ''}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="flex-1">{label}</span>}
              {!collapsed && active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <button onClick={() => setShowLogout(true)}
          className="nav-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <LogoutDialog open={showLogout} onOpenChange={setShowLogout} onConfirm={handleLogout} />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const rolePrefix = user?.role === 'admin' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/student';

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="fixed top-0 left-0 h-full z-30 transition-all duration-300" style={{ width: sidebarCollapsed ? '4rem' : '16rem' }}>
          <SidebarContent collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-4 sticky top-0 z-20">
          <button onClick={() => { setSidebarCollapsed(!sidebarCollapsed); }} className="hidden lg:flex p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Notification Bell */}
          <button onClick={() => navigate(`${rolePrefix}/notifications`)} className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* User Avatar - click to profile */}
          <button onClick={() => navigate(`${rolePrefix}/profile`)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-foreground leading-tight">{user?.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
            </div>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
