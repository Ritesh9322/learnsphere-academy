import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockEnrollments, mockAssignments, mockQuizzes, quizPerformanceData, monthlyEnrollmentData } from '@/data/mockData';
import { BookOpen, FileText, ClipboardList, CalendarDays, TrendingUp, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ icon: Icon, label, value, sub, gradient }: { icon: React.ElementType; label: string; value: string | number; sub?: string; gradient: string }) {
  return (
    <div className="stat-card flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: gradient }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-foreground">{value}</div>
        <div className="text-sm font-medium text-foreground/80">{label}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const pending = mockAssignments.filter(a => a.status === 'pending');
  const avgProgress = Math.round(mockEnrollments.reduce((s, e) => s + e.progress, 0) / mockEnrollments.length);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your learning today.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} label="Enrolled Courses" value={mockEnrollments.length} sub="Active learning" gradient="var(--gradient-primary)" />
          <StatCard icon={TrendingUp} label="Avg Progress" value={`${avgProgress}%`} sub="Across all courses" gradient="var(--gradient-success)" />
          <StatCard icon={FileText} label="Pending Tasks" value={pending.length} sub="Due this week" gradient="var(--gradient-warning)" />
          <StatCard icon={ClipboardList} label="Quizzes Taken" value={mockQuizzes.filter(q => q.status === 'completed').length} sub="This semester" gradient="var(--gradient-info)" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course Progress */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Course Progress</h2>
            <div className="space-y-5">
              {mockEnrollments.map(e => (
                <div key={e.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={e.thumbnail} alt={e.courseName} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{e.courseName}</div>
                      <div className="text-xs text-muted-foreground">{e.instructor} · {e.completedLessons}/{e.totalLessons} lessons</div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'hsl(var(--primary))' }}>{e.progress}%</span>
                  </div>
                  <div className="progress-bar ml-13">
                    <div className="progress-fill" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {pending.map(a => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--warning))' }} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.courseName}</div>
                    <div className="text-xs mt-1 font-medium" style={{ color: 'hsl(var(--destructive))' }}>
                      Due: {new Date(a.dueDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <ClipboardList className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--info))' }} />
                <div>
                  <div className="text-sm font-medium text-foreground">Python & Pandas Quiz</div>
                  <div className="text-xs text-muted-foreground">Data Science & ML</div>
                  <div className="text-xs mt-1 font-medium" style={{ color: 'hsl(var(--info))' }}>Available Now</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quiz Performance */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Quiz Performance</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={quizPerformanceData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Learning Activity */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Monthly Enrollment Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyEnrollmentData}>
                <defs>
                  <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="enrollments" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorEnroll)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Recent Assignments</h2>
            <button className="text-sm text-primary hover:underline font-medium">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Assignment</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Due Date</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {mockAssignments.map(a => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{a.title}</td>
                    <td className="py-3 text-muted-foreground">{a.courseName}</td>
                    <td className="py-3 text-muted-foreground">{new Date(a.dueDate).toLocaleDateString('en-IN')}</td>
                    <td className="py-3">
                      <span className={a.status === 'pending' ? 'badge-warning' : a.status === 'submitted' ? 'badge-info' : 'badge-success'}>
                        {a.status === 'pending' ? 'Pending' : a.status === 'submitted' ? 'Submitted' : 'Graded'}
                      </span>
                    </td>
                    <td className="py-3">
                      {a.grade ? <span className="font-semibold text-foreground">{a.grade}/100</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Quiz Info */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockQuizzes.map(q => (
            <div key={q.id} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className={q.status === 'completed' ? 'badge-success' : q.status === 'available' ? 'badge-info' : 'badge-warning'}>
                  {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                </span>
                {q.status === 'completed' && <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(var(--success))' }} />}
              </div>
              <div className="font-medium text-foreground text-sm mb-1">{q.title}</div>
              <div className="text-xs text-muted-foreground mb-2">{q.courseName}</div>
              {q.score !== undefined && (
                <div className="text-lg font-display font-bold" style={{ color: 'hsl(var(--primary))' }}>{q.score}/{q.totalMarks}</div>
              )}
              <div className="text-xs text-muted-foreground">{q.duration} min · {q.questions} questions</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
