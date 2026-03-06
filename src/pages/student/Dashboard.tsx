import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, ClipboardList, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data: enrollData } = await supabase.from('enrollments').select('*, courses(title, thumbnail)').eq('student_id', user.id);
      const courseIds = (enrollData || []).map(e => e.course_id);

      let assignData: any[] = [], quizData: any[] = [];
      if (courseIds.length > 0) {
        const [aRes, qRes] = await Promise.all([
          supabase.from('assignments').select('*, courses(title)').in('course_id', courseIds).order('created_at', { ascending: false }).limit(5),
          supabase.from('quizzes').select('*, courses(title)').in('course_id', courseIds),
        ]);
        assignData = aRes.data || [];
        quizData = qRes.data || [];
      }
      const { data: attData } = await supabase.from('quiz_attempts').select('*').eq('student_id', user.id);

      setEnrollments(enrollData || []);
      setAssignments(assignData);
      setQuizzes(quizData);
      setQuizAttempts(attData || []);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  const avgProgress = enrollments.length > 0 ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length) : 0;
  const completedQuizzes = quizzes.filter(q => quizAttempts.some(a => a.quiz_id === q.id));
  const quizChartData = completedQuizzes.map(q => {
    const att = quizAttempts.find(a => a.quiz_id === q.id);
    return { name: q.title?.substring(0, 12) || 'Quiz', score: att ? Math.round((att.score / (q.total_marks || 1)) * 100) : 0 };
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} label="Enrolled Courses" value={enrollments.length} sub="Active learning" gradient="var(--gradient-primary)" />
          <StatCard icon={TrendingUp} label="Avg Progress" value={`${avgProgress}%`} sub="Across all courses" gradient="var(--gradient-success)" />
          <StatCard icon={FileText} label="Assignments" value={assignments.length} sub="From your courses" gradient="var(--gradient-warning)" />
          <StatCard icon={ClipboardList} label="Quizzes Taken" value={quizAttempts.length} sub="This semester" gradient="var(--gradient-info)" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Course Progress</h2>
            {enrollments.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No courses enrolled yet.</p> : (
              <div className="space-y-5">
                {enrollments.map((e: any) => (
                  <div key={e.id} className="cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors" onClick={() => navigate(`/student/courses/${e.course_id}`)}>
                    <div className="flex items-center gap-3 mb-2">
                      <img src={e.courses?.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{e.courses?.title}</div>
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'hsl(var(--primary))' }}>{e.progress || 0}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${e.progress || 0}%` }} /></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Recent Assignments</h2>
            {assignments.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No assignments yet.</p> : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((a: any) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors" onClick={() => navigate(`/student/assignments/${a.id}`)}>
                    <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--warning))' }} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.courses?.title}</div>
                      {a.due_date && <div className="text-xs mt-1 font-medium" style={{ color: 'hsl(var(--destructive))' }}>Due: {new Date(a.due_date).toLocaleDateString('en-IN')}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {quizChartData.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Quiz Performance</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={quizChartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
