import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeacherAnalytics() {
  const [stats, setStats] = useState({ students: 0, courses: 0, assignments: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [quizData, setQuizData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [coursesRes, enrollRes, assignRes, quizRes] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('enrollments').select('student_id, enrolled_at'),
        supabase.from('assignments').select('id', { count: 'exact' }),
        supabase.from('quiz_attempts').select('score'),
      ]);

      const uniqueStudents = new Set((enrollRes.data || []).map(e => e.student_id)).size;
      const scores = (quizRes.data || []).map(q => q.score).filter(Boolean) as number[];
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      setStats({
        students: uniqueStudents,
        courses: coursesRes.count || 0,
        assignments: assignRes.count || 0,
        avgScore: avg,
      });

      // Build enrollment trend by month
      const months: Record<string, number> = {};
      (enrollRes.data || []).forEach(e => {
        const m = new Date(e.enrolled_at || '').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        months[m] = (months[m] || 0) + 1;
      });
      setEnrollmentData(Object.entries(months).map(([month, count]) => ({ month, enrollments: count })));

      // Build quiz performance
      const { data: quizzes } = await supabase.from('quizzes').select('id, title');
      const quizPerf = (quizzes || []).map(q => {
        const attempts = (quizRes.data || []).filter((a: any) => a.quiz_id === q.id);
        const qScores = attempts.map((a: any) => a.score).filter(Boolean) as number[];
        return { name: q.title.substring(0, 15), score: qScores.length > 0 ? Math.round(qScores.reduce((a: number, b: number) => a + b, 0) / qScores.length) : 0 };
      });
      setQuizData(quizPerf);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Track performance and engagement</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Users className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{stats.students}</div><div className="text-xs text-muted-foreground">Total Students</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><BookOpen className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{stats.courses}</div><div className="text-xs text-muted-foreground">Total Courses</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><FileText className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{stats.assignments}</div><div className="text-xs text-muted-foreground">Assignments</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-purple)' }}><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{stats.avgScore}%</div><div className="text-xs text-muted-foreground">Avg Quiz Score</div></div>
          </div>
        </div>

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
            <h2 className="font-display font-semibold text-foreground mb-4">Quiz Performance (Avg Scores)</h2>
            {quizData.length === 0 ? <p className="text-sm text-muted-foreground text-center py-10">No quiz data yet.</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={quizData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
