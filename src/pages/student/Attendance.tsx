import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle2, XCircle, TrendingUp, Loader2 } from 'lucide-react';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courseAttendance, setCourseAttendance] = useState<{ courseId: string; courseName: string; present: number; total: number; percentage: number }[]>([]);
  const [recentLog, setRecentLog] = useState<{ date: string; course: string; status: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data: enrollments } = await supabase.from('enrollments').select('course_id, courses(title)').eq('student_id', user.id);
      if (!enrollments || enrollments.length === 0) { setLoading(false); return; }

      const courseIds = enrollments.map(e => e.course_id);
      const { data: attendanceData } = await supabase.from('attendance').select('*').in('course_id', courseIds).order('date', { ascending: false });

      const courseMap: Record<string, { courseName: string; present: number; total: number }> = {};
      const logs: { date: string; course: string; status: string }[] = [];

      (attendanceData || []).forEach(a => {
        const enrollment = enrollments.find(e => e.course_id === a.course_id);
        const courseName = (enrollment as any)?.courses?.title || 'Unknown';
        if (!courseMap[a.course_id]) courseMap[a.course_id] = { courseName, present: 0, total: 0 };
        courseMap[a.course_id].total++;
        const isPresent = (a.present_students as string[] || []).includes(user.id);
        if (isPresent) courseMap[a.course_id].present++;
        logs.push({ date: a.date, course: courseName, status: isPresent ? 'present' : 'absent' });
      });

      setCourseAttendance(Object.entries(courseMap).map(([courseId, data]) => ({
        courseId, ...data, percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
      })));
      setRecentLog(logs.slice(0, 15));
      setLoading(false);
    };
    load();
  }, [user]);

  const totalPresent = courseAttendance.reduce((s, c) => s + c.present, 0);
  const totalClasses = courseAttendance.reduce((s, c) => s + c.total, 0);
  const totalAbsent = totalClasses - totalPresent;
  const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your class attendance across all courses</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{overallPct}%</div><div className="text-xs text-muted-foreground">Overall</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><CheckCircle2 className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{totalPresent}</div><div className="text-xs text-muted-foreground">Present</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--destructive)/0.15)' }}><XCircle className="w-5 h-5" style={{ color: 'hsl(var(--destructive))' }} /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{totalAbsent}</div><div className="text-xs text-muted-foreground">Absent</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-info)' }}><CalendarDays className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{totalClasses}</div><div className="text-xs text-muted-foreground">Total Classes</div></div>
          </div>
        </div>

        {/* Course-wise */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-foreground mb-4">Course-wise Attendance</h2>
          {courseAttendance.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No attendance data available yet.</p>
          ) : (
            <div className="space-y-5">
              {courseAttendance.map(c => (
                <div key={c.courseId}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-foreground">{c.courseName}</div>
                      <div className="text-xs text-muted-foreground">{c.present}/{c.total} classes attended</div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: c.percentage >= 85 ? 'hsl(var(--success))' : c.percentage >= 75 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))' }}>
                      {c.percentage}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${c.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Log */}
        {recentLog.length > 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-display font-semibold text-foreground">Recent Attendance Log</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-5 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
                  <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLog.map((a, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5 text-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                        {new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-muted-foreground">{a.course}</td>
                    <td className="py-3 px-5">
                      <span className={a.status === 'present' ? 'badge-success' : 'badge-primary'} style={a.status === 'absent' ? { background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' } : {}}>
                        {a.status === 'present' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                        {a.status === 'absent' && <XCircle className="w-3 h-3 mr-1 inline" />}
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
