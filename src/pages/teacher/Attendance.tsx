import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle2, XCircle, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface CourseOption { id: string; title: string; }
interface StudentProfile { user_id: string; name: string; }

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('courses').select('id, title').then(({ data }) => {
      if (data && data.length > 0) { setCourses(data); setSelectedCourse(data[0].id); }
    });
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);
    // Get enrolled students
    supabase.from('enrollments').select('student_id').eq('course_id', selectedCourse).then(async ({ data: enrollments }) => {
      if (!enrollments || enrollments.length === 0) { setStudents([]); setAttendance({}); setLoading(false); return; }
      const studentIds = enrollments.map(e => e.student_id);
      const { data: profiles } = await supabase.from('profiles').select('user_id, name').in('user_id', studentIds);
      const studentList = profiles || [];
      setStudents(studentList);

      // Check existing attendance
      const { data: existing } = await supabase.from('attendance').select('*').eq('course_id', selectedCourse).eq('date', selectedDate).maybeSingle();
      if (existing) {
        setExistingId(existing.id);
        const presentIds = (existing.present_students as string[]) || [];
        setAttendance(Object.fromEntries(studentList.map(s => [s.user_id, presentIds.includes(s.user_id)])));
      } else {
        setExistingId(null);
        setAttendance(Object.fromEntries(studentList.map(s => [s.user_id, true])));
      }
      setLoading(false);
    });
  }, [selectedCourse, selectedDate]);

  const toggleAttendance = (id: string) => setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  const markAllPresent = () => setAttendance(prev => Object.fromEntries(Object.keys(prev).map(k => [k, true])));

  const handleSave = async () => {
    setSaving(true);
    const presentStudents = Object.entries(attendance).filter(([, v]) => v).map(([k]) => k);

    if (existingId) {
      await supabase.from('attendance').update({ present_students: presentStudents }).eq('id', existingId);
    } else {
      await supabase.from('attendance').insert({ course_id: selectedCourse, date: selectedDate, present_students: presentStudents });
    }
    setSaving(false);
    toast({ title: existingId ? 'Attendance updated!' : 'Attendance saved!' });
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Mark and manage student attendance</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground">Course</label>
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : students.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No students enrolled in this course yet.</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="badge-success">{presentCount} Present</span>
                <span className="badge-primary" style={{ background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' }}>{students.length - presentCount} Absent</span>
                <Button onClick={markAllPresent} variant="outline" size="sm" className="ml-auto text-xs">Mark All Present</Button>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Student Name</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Present</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Absent</th>
                  </tr></thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.user_id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{s.name.charAt(0)}</div>
                            <span className="font-medium text-foreground">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => { if (!attendance[s.user_id]) toggleAttendance(s.user_id); }}>
                            <CheckCircle2 className={`w-5 h-5 mx-auto ${attendance[s.user_id] ? '' : 'opacity-20'}`} style={{ color: attendance[s.user_id] ? 'hsl(var(--success))' : undefined }} />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => { if (attendance[s.user_id]) toggleAttendance(s.user_id); }}>
                            <XCircle className={`w-5 h-5 mx-auto ${!attendance[s.user_id] ? '' : 'opacity-20'}`} style={{ color: !attendance[s.user_id] ? 'hsl(var(--destructive))' : undefined }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button onClick={handleSave} disabled={saving} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {existingId ? 'Update Attendance' : 'Save Attendance'}
              </Button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
