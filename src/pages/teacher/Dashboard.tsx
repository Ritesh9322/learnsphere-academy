import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, mockEnrollments, monthlyEnrollmentData, revenueData } from '@/data/mockData';
import { BookOpen, Users, FileText, TrendingUp, Plus, Eye, Edit3, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

function StatCard({ icon: Icon, label, value, delta, gradient }: { icon: React.ElementType; label: string; value: string | number; delta?: string; gradient: string }) {
  return (
    <div className="stat-card flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: gradient }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-foreground">{value}</div>
        <div className="text-sm text-foreground/80 font-medium">{label}</div>
        {delta && <div className="text-xs mt-0.5" style={{ color: 'hsl(var(--success))' }}>{delta}</div>}
      </div>
    </div>
  );
}

const teacherCourses = mockCourses.filter(c => c.instructor === 'teacher1');

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Instructor Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name}. Manage your courses and students.</p>
          </div>
          <Button style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
            <Plus className="w-4 h-4 mr-2" />Create New Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} label="Total Courses" value={teacherCourses.length} delta="+1 this month" gradient="var(--gradient-primary)" />
          <StatCard icon={Users} label="Total Students" value={teacherCourses.reduce((s, c) => s + c.students, 0)} delta="+23 this week" gradient="var(--gradient-success)" />
          <StatCard icon={FileText} label="Submissions" value={18} delta="6 ungraded" gradient="var(--gradient-warning)" />
          <StatCard icon={TrendingUp} label="Avg Rating" value="4.8★" delta="Top 5%" gradient="var(--gradient-purple)" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Courses */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground">My Courses</h2>
              <Button variant="outline" size="sm" className="font-medium">
                <Plus className="w-3.5 h-3.5 mr-1" />New Course
              </Button>
            </div>
            <div className="space-y-4">
              {teacherCourses.map(course => (
                <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <img src={course.thumbnail} alt={course.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm truncate">{course.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{course.category} · {course.level} · {course.duration}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="w-3 h-3" />{course.students} students</span>
                      <span className="flex items-center gap-1 text-xs text-yellow-500"><Star className="w-3 h-3 fill-yellow-500" />{course.rating}</span>
                      <span className={course.status === 'published' ? 'badge-success' : 'badge-warning'} style={{ fontSize: '10px' }}>{course.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Submissions */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Recent Submissions</h2>
            <div className="space-y-3">
              {[
                { name: 'Rahul V.', assignment: 'Build REST API', course: 'Full Stack', time: '2h ago', status: 'new' },
                { name: 'Priya S.', assignment: 'Linear Regression', course: 'Data Science', time: '5h ago', status: 'new' },
                { name: 'Amit K.', assignment: 'Mobile Prototype', course: 'UI/UX', time: '1d ago', status: 'graded' },
                { name: 'Neha R.', assignment: 'React Dashboard', course: 'Full Stack', time: '2d ago', status: 'graded' },
                { name: 'Karan M.', assignment: 'Build REST API', course: 'Full Stack', time: '3d ago', status: 'graded' },
              ].map((sub, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                    {sub.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{sub.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{sub.assignment}</div>
                  </div>
                  <div className="text-right">
                    <span className={sub.status === 'new' ? 'badge-info' : 'badge-success'} style={{ fontSize: '10px' }}>{sub.status}</span>
                    <div className="text-xs text-muted-foreground mt-0.5">{sub.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Student Enrollment (Monthly)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyEnrollmentData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Revenue Trend (₹)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--success))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Progress Table */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Student Progress Overview</h2>
            <button className="text-sm text-primary hover:underline font-medium">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Student</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Progress</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Lessons</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Last Seen</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Rahul Verma', course: 'Full Stack Web Dev', progress: 68, lessons: '34/50', last: '2h ago', status: 'active' },
                  { name: 'Priya Singh', course: 'Data Science & ML', progress: 42, lessons: '25/60', last: '1d ago', status: 'active' },
                  { name: 'Amit Kumar', course: 'Full Stack Web Dev', progress: 91, lessons: '46/50', last: '3h ago', status: 'active' },
                  { name: 'Neha Reddy', course: 'React Native', progress: 25, lessons: '10/40', last: '5d ago', status: 'idle' },
                  { name: 'Karan Mehta', course: 'Full Stack Web Dev', progress: 55, lessons: '28/50', last: '2d ago', status: 'active' },
                ].map((s, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{s.name}</td>
                    <td className="py-3 text-muted-foreground text-xs">{s.course}</td>
                    <td className="py-3 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 progress-bar"><div className="progress-fill" style={{ width: `${s.progress}%` }} /></div>
                        <span className="text-xs text-muted-foreground w-8">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{s.lessons}</td>
                    <td className="py-3 text-muted-foreground text-xs">{s.last}</td>
                    <td className="py-3"><span className={s.status === 'active' ? 'badge-success' : 'badge-warning'}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
