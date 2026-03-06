import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Award, TrendingUp, BookOpen, Target, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentGrades() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<{ name: string; score: number; total: number; type: string; course: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const [subRes, quizRes] = await Promise.all([
        supabase.from('submissions').select('grade, assignments(title, total_marks, courses(title))').eq('student_id', user.id).not('grade', 'is', null),
        supabase.from('quiz_attempts').select('score, quizzes(title, total_marks, courses(title))').eq('student_id', user.id).not('score', 'is', null),
      ]);

      const allGrades: any[] = [];
      (subRes.data || []).forEach((s: any) => {
        if (s.grade != null) allGrades.push({ name: s.assignments?.title || 'Assignment', score: s.grade, total: s.assignments?.total_marks || 100, type: 'Assignment', course: s.assignments?.courses?.title || '' });
      });
      (quizRes.data || []).forEach((q: any) => {
        if (q.score != null) allGrades.push({ name: q.quizzes?.title || 'Quiz', score: q.score, total: q.quizzes?.total_marks || 100, type: 'Quiz', course: q.quizzes?.courses?.title || '' });
      });

      setGrades(allGrades);
      setLoading(false);
    };
    load();
  }, [user]);

  const avgPercentage = grades.length > 0
    ? Math.round(grades.reduce((s, g) => s + (g.score / g.total) * 100, 0) / grades.length)
    : 0;

  const chartData = grades.map(g => ({
    name: g.name.length > 18 ? g.name.slice(0, 18) + '…' : g.name,
    percentage: Math.round((g.score / g.total) * 100),
  }));

  const getGradeLabel = (pct: number) => {
    if (pct >= 90) return { label: 'A+', color: 'hsl(var(--success))' };
    if (pct >= 80) return { label: 'A', color: 'hsl(var(--success))' };
    if (pct >= 70) return { label: 'B', color: 'hsl(var(--info))' };
    if (pct >= 60) return { label: 'C', color: 'hsl(var(--warning))' };
    return { label: 'D', color: 'hsl(var(--destructive))' };
  };

  const bestScore = grades.length > 0 ? Math.max(...grades.map(g => Math.round((g.score / g.total) * 100))) : 0;

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Grades</h1>
          <p className="text-muted-foreground text-sm mt-1">View your academic performance across assignments and quizzes</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Award className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{avgPercentage}%</div><div className="text-xs text-muted-foreground">Average</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{getGradeLabel(avgPercentage).label}</div><div className="text-xs text-muted-foreground">Overall Grade</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-info)' }}><Target className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{grades.length}</div><div className="text-xs text-muted-foreground">Graded Items</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><BookOpen className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{bestScore}%</div><div className="text-xs text-muted-foreground">Best Score</div></div>
          </div>
        </div>

        {grades.length > 0 && (
          <>
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="font-display font-semibold text-foreground mb-4">Performance Chart</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="font-display font-semibold text-foreground">Detailed Grades</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Item</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Score</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Percentage</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => {
                    const pct = Math.round((g.score / g.total) * 100);
                    const grade = getGradeLabel(pct);
                    return (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-5 font-medium text-foreground">{g.name}</td>
                        <td className="py-3 px-5"><span className={g.type === 'Quiz' ? 'badge-info' : 'badge-warning'}>{g.type}</span></td>
                        <td className="py-3 px-5 text-muted-foreground text-xs">{g.course}</td>
                        <td className="py-3 px-5 font-bold" style={{ color: 'hsl(var(--primary))' }}>{g.score}/{g.total}</td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                            <span className="text-xs text-muted-foreground">{pct}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-5"><span className="font-bold text-sm" style={{ color: grade.color }}>{grade.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {grades.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No grades available yet. Complete assignments and quizzes to see your grades.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
