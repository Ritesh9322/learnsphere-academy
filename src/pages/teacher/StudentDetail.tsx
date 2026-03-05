import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, ClipboardList, CalendarDays, Loader2 } from 'lucide-react';

export default function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);

  useEffect(() => {
    if (!studentId) return;
    const load = async () => {
      setLoading(true);
      const [profileRes, enrollRes, subRes, quizRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', studentId).single(),
        supabase.from('enrollments').select('*, courses(title)').eq('student_id', studentId),
        supabase.from('submissions').select('*, assignments(title)').eq('student_id', studentId),
        supabase.from('quiz_attempts').select('*, quizzes(title)').eq('student_id', studentId),
      ]);
      setProfile(profileRes.data);
      setEnrollments(enrollRes.data || []);
      setSubmissions(subRes.data || []);
      setQuizAttempts(quizRes.data || []);
      setLoading(false);
    };
    load();
  }, [studentId]);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;
  if (!profile) return <DashboardLayout><div className="text-center py-20 text-muted-foreground">Student not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{profile.name}</h1>
            <p className="text-muted-foreground text-sm">{profile.email}</p>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />Enrolled Courses ({enrollments.length})</h2>
          {enrollments.length === 0 ? <p className="text-sm text-muted-foreground">No enrollments.</p> : (
            <div className="space-y-2">
              {enrollments.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">{e.courses?.title}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 progress-bar"><div className="progress-fill" style={{ width: `${e.progress || 0}%` }} /></div>
                    <span className="text-xs text-muted-foreground">{e.progress || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submissions */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><FileText className="w-4 h-4" style={{ color: 'hsl(var(--warning))' }} />Assignment Submissions ({submissions.length})</h2>
          {submissions.length === 0 ? <p className="text-sm text-muted-foreground">No submissions.</p> : (
            <div className="space-y-2">
              {submissions.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">{s.assignments?.title}</span>
                  <div className="text-right">
                    {s.grade != null ? <span className="font-bold text-foreground text-sm">{s.grade}/100</span> : <span className="badge-warning text-[10px]">Pending</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiz Attempts */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><ClipboardList className="w-4 h-4" style={{ color: 'hsl(var(--info))' }} />Quiz Scores ({quizAttempts.length})</h2>
          {quizAttempts.length === 0 ? <p className="text-sm text-muted-foreground">No quiz attempts.</p> : (
            <div className="space-y-2">
              {quizAttempts.map((q: any) => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">{q.quizzes?.title}</span>
                  <span className="font-bold text-foreground text-sm">{q.score ?? '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
