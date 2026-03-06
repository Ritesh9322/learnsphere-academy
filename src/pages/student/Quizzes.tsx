import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, Play, Trophy, Target, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentQuizzes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      // Get enrolled course IDs
      const { data: enrollments } = await supabase.from('enrollments').select('course_id').eq('student_id', user.id);
      const courseIds = (enrollments || []).map(e => e.course_id);

      let quizData: any[] = [];
      if (courseIds.length > 0) {
        const { data } = await supabase.from('quizzes').select('*, courses(title)').in('course_id', courseIds).order('created_at', { ascending: false });
        quizData = data || [];
      }

      const { data: attemptData } = await supabase.from('quiz_attempts').select('*').eq('student_id', user.id);
      setQuizzes(quizData);
      setAttempts(attemptData || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const getAttempt = (quizId: string) => attempts.find(a => a.quiz_id === quizId);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  const completed = quizzes.filter(q => getAttempt(q.id));
  const available = quizzes.filter(q => !getAttempt(q.id));
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, q) => {
        const att = getAttempt(q.id);
        return s + ((att?.score || 0) / (q.total_marks || 1)) * 100;
      }, 0) / completed.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Quizzes</h1>
          <p className="text-muted-foreground text-sm mt-1">Attempt quizzes and track your performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><ClipboardList className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{quizzes.length}</div><div className="text-xs text-muted-foreground">Total Quizzes</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><CheckCircle2 className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{completed.length}</div><div className="text-xs text-muted-foreground">Completed</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-info)' }}><Play className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{available.length}</div><div className="text-xs text-muted-foreground">Available Now</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><Trophy className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{avgScore}%</div><div className="text-xs text-muted-foreground">Avg Score</div></div>
          </div>
        </div>

        {/* Available Quizzes */}
        {available.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Play className="w-4 h-4" style={{ color: 'hsl(var(--info))' }} />Available Quizzes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {available.map(q => {
                const questions = Array.isArray(q.questions) ? q.questions : [];
                return (
                  <div key={q.id} className="bg-card rounded-xl border-2 border-primary/30 p-5 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <span className="badge-info">Available</span>
                      <span className="text-xs text-muted-foreground">{q.duration} min</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{q.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{q.courses?.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" />{questions.length} questions</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{q.total_marks} marks</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{q.duration} min</span>
                    </div>
                    <Button size="sm" className="w-full font-semibold" style={{ background: 'var(--gradient-primary)' }} onClick={() => navigate(`/student/quizzes/${q.id}`)}>
                      <Play className="w-3 h-3 mr-1" />Start Quiz
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(var(--success))' }} />Completed Quizzes
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Quiz</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Score</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Percentage</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {completed.map(q => {
                    const att = getAttempt(q.id);
                    const pct = Math.round(((att?.score || 0) / (q.total_marks || 1)) * 100);
                    return (
                      <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-5 font-medium text-foreground">{q.title}</td>
                        <td className="py-3 px-5 text-muted-foreground text-xs">{q.courses?.title}</td>
                        <td className="py-3 px-5 font-bold" style={{ color: 'hsl(var(--primary))' }}>{att?.score}/{q.total_marks}</td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                            <span className="text-xs text-muted-foreground">{pct}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate(`/student/quizzes/${q.id}`)}>View Results</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {quizzes.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No quizzes available yet. Enroll in courses to access quizzes.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
