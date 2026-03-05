import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Eye, Edit3, Trash2, Loader2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface StudentRow {
  user_id: string;
  name: string;
  email: string;
  courseName: string;
  progress: number;
  attendancePct: number;
}

export default function TeacherStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    // Get all enrollments with course info
    const { data: enrollments } = await supabase.from('enrollments').select('student_id, progress, course_id, courses(title)');
    if (!enrollments || enrollments.length === 0) { setStudents([]); setLoading(false); return; }

    const studentIds = [...new Set(enrollments.map(e => e.student_id))];
    const { data: profiles } = await supabase.from('profiles').select('user_id, name, email').in('user_id', studentIds);
    
    // Get attendance data
    const { data: attendanceData } = await supabase.from('attendance').select('course_id, present_students');

    const rows: StudentRow[] = enrollments.map(e => {
      const profile = profiles?.find(p => p.user_id === e.student_id);
      const courseTitle = (e as any).courses?.title || 'Unknown';
      
      // Calculate attendance percentage
      const courseAttendance = attendanceData?.filter(a => a.course_id === e.course_id) || [];
      const totalDays = courseAttendance.length;
      const presentDays = courseAttendance.filter(a => (a.present_students as string[] || []).includes(e.student_id)).length;
      const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      return {
        user_id: e.student_id,
        name: profile?.name || 'Unknown',
        email: profile?.email || '',
        courseName: courseTitle,
        progress: e.progress || 0,
        attendancePct,
      };
    });

    setStudents(rows);
    setLoading(false);
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage enrolled students</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Users className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{students.length}</div><div className="text-xs text-muted-foreground">Total</div></div>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No students found.</div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Student</th>
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Progress</th>
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Attendance</th>
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={`${s.user_id}-${i}`} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{s.name.charAt(0)}</div>
                        <div><div className="font-medium text-foreground text-xs">{s.name}</div><div className="text-[10px] text-muted-foreground">{s.email}</div></div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-muted-foreground text-xs">{s.courseName}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-14 progress-bar"><div className="progress-fill" style={{ width: `${s.progress}%` }} /></div>
                        <span className="text-xs text-muted-foreground">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-xs font-medium" style={{ color: s.attendancePct >= 75 ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>{s.attendancePct}%</td>
                    <td className="py-3 px-5">
                      <div className="flex gap-1">
                        <button onClick={() => navigate(`/${window.location.pathname.split('/')[1]}/students/${s.user_id}`)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                      </div>
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
