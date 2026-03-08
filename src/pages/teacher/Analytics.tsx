import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, BookOpen, FileText, TrendingUp, Loader2, IndianRupee } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function TeacherAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, courses: 0, assignments: 0, avgScore: 0, revenue: 0 });
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [courseBreakdown, setCourseBreakdown] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);

      // 1. Get teacher's own courses
      const { data: myCourses } = await supabase
        .from('courses')
        .select('id, title')
        .eq('instructor_id', user.id);

      const courseIds = (myCourses || []).map(c => c.id);
      if (courseIds.length === 0) {
        setStats({ students: 0, courses: 0, assignments: 0, avgScore: 0, revenue: 0 });
        setLoading(false);
        return;
      }

      // 2. Parallel fetches scoped to teacher's courses
      const [enrollRes, assignRes, quizRes, payRes, quizzesRes] = await Promise.all([
        supabase.from('enrollments').select('student_id, enrolled_at, course_id').in('course_id', courseIds),
        supabase.from('assignments').select('id', { count: 'exact' }).in('course_id', courseIds),
        supabase.from('quiz_attempts').select('score, quiz_id').in('quiz_id',
          await supabase.from('quizzes').select('id').in('course_id', courseIds).then(r => (r.data || []).map(q => q.id))
        ),
        supabase.from('payments').select('amount, paid_at, course_id').in('course_id', courseIds).eq('status', 'completed'),
        supabase.from('quizzes').select('id, title').in('course_id', courseIds),
      ]);

      const uniqueStudents = new Set((enrollRes.data || []).map(e => e.student_id)).size;
      const scores = (quizRes.data || []).map(q => q.score).filter(Boolean) as number[];
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const totalRevenue = (payRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);

      setStats({
        students: uniqueStudents,
        courses: courseIds.length,
        assignments: assignRes.count || 0,
        avgScore: avg,
        revenue: totalRevenue,
      });

      // 3. Enrollment trend by month
      const months: Record<string, number> = {};
      (enrollRes.data || []).forEach(e => {
        const m = new Date(e.enrolled_at || '').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (m && m !== 'Invalid Date') months[m] = (months[m] || 0) + 1;
      });
      setEnrollmentData(Object.entries(months).map(([month, count]) => ({ month, enrollments: count })));

      // 4. Revenue by month
      const revMonths: Record<string, number> = {};
      (payRes.data || []).forEach(p => {
        const m = new Date(p.paid_at || '').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (m && m !== 'Invalid Date') revMonths[m] = (revMonths[m] || 0) + Number(p.amount);
      });
      setRevenueData(Object.entries(revMonths).map(([month, amount]) => ({ month, revenue: amount })));

      // 5. Quiz performance
      const quizPerf = (quizzesRes.data || []).map(q => {
        const attempts = (quizRes.data || []).filter((a: any) => a.quiz_id === q.id);
        const qScores = attempts.map((a: any) => a.score).filter(Boolean) as number[];
        return { name: q.title.substring(0, 15), score: qScores.length ? Math.round(qScores.reduce((a: number, b: number) => a + b, 0) / qScores.length) : 0 };
      });
      setQuizData(quizPerf);

      // 6. Course enrollment breakdown for pie chart
      const courseMap: Record<string, number> = {};
      (enrollRes.data || []).forEach(e => { courseMap[e.course_id] = (courseMap[e.course_id] || 0) + 1; });
      const breakdown = (myCourses || []).map(c => ({
        name: c.title.length > 20 ? c.title.substring(0, 20) + '…' : c.title,
        value: courseMap[c.id] || 0,
      })).filter(c => c.value > 0);
      setCourseBreakdown(breakdown);

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Performance data for your courses</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Students', value: stats.students, icon: Users, gradient: 'var(--gradient-primary)' },
            { label: 'Courses', value: stats.courses, icon: BookOpen, gradient: 'var(--gradient-success)' },
            { label: 'Assignments', value: stats.assignments, icon: FileText, gradient: 'var(--gradient-warning)' },
            { label: 'Avg Score', value: `${stats.avgScore}%`, icon: TrendingUp, gradient: 'var(--gradient-purple)' },
            { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, gradient: 'var(--gradient-primary)' },
          ].map(s => (
            <div key={s.label} className="stat-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.gradient }}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-display font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Student Enrollment Trend</h2>
            {enrollmentData.length === 0 ? <p className="text-sm text-muted-foreground text-center py-10">No enrollment data yet.</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={enrollmentData}>
                  <defs><linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="enrollments" stroke="hsl(var(--primary))" fill="url(#enrollGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Revenue by Month</h2>
            {revenueData.length === 0 ? <p className="text-sm text-muted-foreground text-center py-10">No revenue data yet.</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${v}`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Quiz Performance (Avg Scores)</h2>
            {quizData.length === 0 ? <p className="text-sm text-muted-foreground text-center py-10">No quiz data yet.</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={quizData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="score" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Enrollment by Course</h2>
            {courseBreakdown.length === 0 ? <p className="text-sm text-muted-foreground text-center py-10">No data yet.</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={courseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                    {courseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
