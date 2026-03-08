import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, DollarSign, TrendingUp, UserCheck, ShieldCheck,
  BarChart3, Activity, Plus, Search, Eye, Edit3, Trash2, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [usersRes, coursesRes, paymentsRes, enrollRes] = await Promise.all([
        supabase.from('profiles').select('*, user_roles(role)'),
        supabase.from('courses').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('payments').select('*, courses(title)').order('paid_at', { ascending: false }).limit(20),
        supabase.from('enrollments').select('*'),
      ]);
      setUsers(usersRes.data || []);
      setCourses(coursesRes.data || []);
      setPayments(paymentsRes.data || []);
      setEnrollments(enrollRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  const studentCount = users.filter((u: any) => u.user_roles?.[0]?.role === 'student' || (!u.user_roles?.length)).length;
  const teacherCount = users.filter((u: any) => u.user_roles?.[0]?.role === 'teacher').length;
  const totalRevenue = payments.filter(p => p.status === 'completed' || p.status === 'paid').reduce((s, p) => s + Number(p.amount || 0), 0);
  const uniqueStudents = new Set(enrollments.map(e => e.student_id)).size;

  // Build category data from real courses
  const categoryMap: Record<string, number> = {};
  courses.forEach(c => {
    const cat = c.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Monthly enrollment data from real enrollments
  const monthlyMap: Record<string, number> = {};
  enrollments.forEach(e => {
    const d = new Date(e.enrolled_at);
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    monthlyMap[key] = (monthlyMap[key] || 0) + 1;
  });
  const monthlyEnrollmentData = Object.entries(monthlyMap).slice(-7).map(([month, enrollments]) => ({ month, enrollments }));

  // Revenue by month
  const revenueMap: Record<string, number> = {};
  payments.filter(p => p.status === 'completed' || p.status === 'paid').forEach(p => {
    const d = new Date(p.paid_at);
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    revenueMap[key] = (revenueMap[key] || 0) + Number(p.amount || 0);
  });
  const revenueData = Object.entries(revenueMap).slice(-7).map(([month, revenue]) => ({ month, revenue }));

  const filtered = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    await supabase.from('courses').delete().eq('id', id);
    setCourses(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Course deleted' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Students" value={uniqueStudents.toLocaleString()} delta={`${studentCount} registered`} gradient="var(--gradient-primary)" />
          <StatCard icon={UserCheck} label="Active Teachers" value={teacherCount} gradient="var(--gradient-success)" />
          <StatCard icon={DollarSign} label="Total Revenue" value={`₹${totalRevenue > 100000 ? (totalRevenue / 100000).toFixed(1) + 'L' : totalRevenue.toLocaleString()}`} gradient="var(--gradient-warning)" />
          <StatCard icon={BookOpen} label="Total Courses" value={courses.length} gradient="var(--gradient-info)" />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Revenue Analytics</h2>
            {revenueData.length === 0 ? <p className="text-sm text-muted-foreground text-center py-10">No revenue data yet.</p> : (
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
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Courses by Category</h2>
            {categoryData.length === 0 ? <p className="text-sm text-muted-foreground text-center py-10">No courses yet.</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Monthly Enrollment */}
        {monthlyEnrollmentData.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Monthly Enrollments</h2>
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
        )}

        {/* User Management */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-display font-semibold text-foreground">User Management</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-9 h-8 w-56 text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">User</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Role</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Joined</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 10).map((u: any) => {
                  const role = u.user_roles?.[0]?.role || 'student';
                  return (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{u.name?.charAt(0) || '?'}</div>
                          <span className="font-medium text-foreground">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">{u.email}</td>
                      <td className="py-3">
                        <span className={role === 'admin' ? 'badge-info' : role === 'teacher' ? 'badge-warning' : 'badge-primary'}>{role}</span>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Management */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Course Management</h2>
            <Button size="sm" onClick={() => navigate('/admin/courses')} variant="outline" className="font-medium">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Category</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Price</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 6).map((c: any) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={c.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100'} alt={c.title} className="w-10 h-7 rounded object-cover" />
                        <span className="font-medium text-foreground text-xs max-w-[160px] truncate">{c.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs"><span className="badge-primary">{c.category || 'N/A'}</span></td>
                    <td className="py-3 font-medium text-foreground text-xs">₹{Number(c.price || 0).toLocaleString()}</td>
                    <td className="py-3"><span className={c.status === 'published' ? 'badge-success' : 'badge-warning'} style={{ fontSize: '10px' }}>{c.status}</span></td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/admin/courses/${c.id}`)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteCourse(c.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Health */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: 'Security', value: 'Secure', sub: 'All systems operational', gradient: 'var(--gradient-success)' },
            { icon: TrendingUp, label: 'Total Enrollments', value: enrollments.length.toString(), sub: 'All time', gradient: 'var(--gradient-info)' },
            { icon: BarChart3, label: 'Total Payments', value: payments.length.toString(), sub: 'Transactions', gradient: 'var(--gradient-purple)' },
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
