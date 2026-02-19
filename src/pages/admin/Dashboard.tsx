import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockCourses, revenueData, monthlyEnrollmentData, categoryData } from '@/data/mockData';
import {
  Users, BookOpen, DollarSign, TrendingUp, UserCheck, UserX, ShieldCheck,
  BarChart3, Activity, Plus, Search, Eye, Edit3, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useState } from 'react';

function StatCard({ icon: Icon, label, value, delta, gradient, deltaPositive = true }: any) {
  return (
    <div className="stat-card flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: gradient }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-foreground">{value}</div>
        <div className="text-sm font-medium text-foreground/80">{label}</div>
        {delta && <div className="text-xs mt-0.5" style={{ color: deltaPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>{delta}</div>}
      </div>
    </div>
  );
}

const PIE_COLORS = ['hsl(221,83%,53%)', 'hsl(142,71%,45%)', 'hsl(199,89%,48%)', 'hsl(38,92%,50%)', 'hsl(250,83%,55%)', 'hsl(0,84%,60%)'];

const mockUsers = [
  { id: 1, name: 'Rahul Verma', email: 'rahul@email.com', role: 'student', status: 'active', joined: '2024-01-10', courses: 3 },
  { id: 2, name: 'Dr. Priya Sharma', email: 'priya@email.com', role: 'teacher', status: 'active', joined: '2023-07-15', courses: 3 },
  { id: 3, name: 'Neha Reddy', email: 'neha@email.com', role: 'student', status: 'active', joined: '2024-02-05', courses: 2 },
  { id: 4, name: 'Mr. Vikram Singh', email: 'vikram@email.com', role: 'teacher', status: 'active', joined: '2023-08-20', courses: 2 },
  { id: 5, name: 'Aditya Bose', email: 'aditya@email.com', role: 'student', status: 'blocked', joined: '2024-01-22', courses: 1 },
  { id: 6, name: 'Kavya Patel', email: 'kavya@email.com', role: 'student', status: 'active', joined: '2024-03-01', courses: 4 },
];

export default function AdminDashboard() {
  const [userSearch, setUserSearch] = useState('');
  const filtered = mockUsers.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Admin Control Center</h1>
            <p className="text-muted-foreground text-sm mt-1">Complete platform overview and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="font-medium"><Activity className="w-4 h-4 mr-1" />Live View</Button>
            <Button size="sm" className="font-semibold" style={{ background: 'var(--gradient-primary)' }}><Plus className="w-4 h-4 mr-1" />Add User</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Students" value="10,284" delta="+312 this month" gradient="var(--gradient-primary)" />
          <StatCard icon={UserCheck} label="Active Teachers" value="148" delta="+12 approved" gradient="var(--gradient-success)" />
          <StatCard icon={DollarSign} label="Total Revenue" value="₹42.5L" delta="+18% vs last month" gradient="var(--gradient-warning)" />
          <StatCard icon={BookOpen} label="Total Courses" value={mockCourses.length} delta="2 awaiting review" gradient="var(--gradient-info)" />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground">Revenue Analytics</h2>
              <span className="badge-success text-xs">₹4.25L this month</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221,83%,53%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(221,83%,53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(221,83%,53%)" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Courses by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Enrollment */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Monthly Enrollments</h2>
            <div className="flex gap-2">
              <span className="badge-info">7-month trend</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyEnrollmentData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="enrollments" fill="hsl(221,83%,53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Management */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-display font-semibold text-foreground">User Management</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-9 h-8 w-56 text-sm" />
              </div>
              <Button size="sm" variant="outline" className="font-medium">Export</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">User</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Role</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Joined</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Courses</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{u.name.charAt(0)}</div>
                        <span className="font-medium text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{u.email}</td>
                    <td className="py-3">
                      <span className={u.role === 'admin' ? 'badge-info' : u.role === 'teacher' ? 'badge-warning' : 'badge-primary'}>{u.role}</span>
                    </td>
                    <td className="py-3">
                      <span className={u.status === 'active' ? 'badge-success' : 'badge-warning'}>{u.status}</span>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{new Date(u.joined).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 text-muted-foreground text-center">{u.courses}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                        <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Management */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Course Management</h2>
            <Button size="sm" style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Plus className="w-3.5 h-3.5 mr-1" />Add Course</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Instructor</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Category</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Students</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Price</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Rating</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCourses.map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={c.thumbnail} alt={c.title} className="w-10 h-7 rounded object-cover" />
                        <span className="font-medium text-foreground text-xs max-w-[160px] truncate">{c.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{c.instructorName}</td>
                    <td className="py-3 text-xs"><span className="badge-primary">{c.category}</span></td>
                    <td className="py-3 text-muted-foreground text-xs">{c.students}</td>
                    <td className="py-3 font-medium text-foreground text-xs">₹{c.price.toLocaleString()}</td>
                    <td className="py-3 text-xs text-yellow-500">★ {c.rating}</td>
                    <td className="py-3"><span className={c.status === 'published' ? 'badge-success' : 'badge-warning'} style={{ fontSize: '10px' }}>{c.status}</span></td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security + Platform Health */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: 'Security Events', value: '0', sub: 'No threats detected', gradient: 'var(--gradient-success)' },
            { icon: TrendingUp, label: 'Platform Uptime', value: '99.9%', sub: 'Last 30 days', gradient: 'var(--gradient-info)' },
            { icon: BarChart3, label: 'API Requests', value: '48.2K', sub: 'Today', gradient: 'var(--gradient-purple)' },
          ].map(({ icon: Icon, label, value, sub, gradient }) => (
            <div key={label} className="stat-card flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: gradient }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-display font-bold text-foreground">{value}</div>
                <div className="text-sm font-medium text-foreground/80">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
