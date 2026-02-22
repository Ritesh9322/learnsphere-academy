import DashboardLayout from '@/components/layout/DashboardLayout';
import { monthlyEnrollmentData, revenueData, quizPerformanceData } from '@/data/mockData';
import { TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const courseEngagement = [
  { name: 'Full Stack', completion: 72, engagement: 85 },
  { name: 'Data Science', completion: 58, engagement: 78 },
  { name: 'React Native', completion: 45, engagement: 65 },
];

export default function TeacherAnalytics() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your teaching performance and student engagement</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Users className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">713</div><div className="text-xs text-muted-foreground">Total Students</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">4.8★</div><div className="text-xs text-muted-foreground">Avg Rating</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-info)' }}><BookOpen className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">72%</div><div className="text-xs text-muted-foreground">Completion Rate</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><DollarSign className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">₹8.4L</div><div className="text-xs text-muted-foreground">Revenue</div></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Student Enrollment Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyEnrollmentData}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="enrollments" stroke="hsl(var(--primary))" fill="url(#enrollGrad)" strokeWidth={2} />
              </AreaChart>
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

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Quiz Performance (Avg Scores)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={quizPerformanceData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Course Engagement</h2>
            <div className="space-y-5">
              {courseEngagement.map(c => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.completion}% completion</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-muted-foreground mb-1">Completion</div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.completion}%` }} /></div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground mb-1">Engagement</div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.engagement}%`, background: 'hsl(var(--success))' }} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
