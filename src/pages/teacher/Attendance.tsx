import DashboardLayout from '@/components/layout/DashboardLayout';
import { CalendarDays, CheckCircle2, XCircle, Users, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

const courses = ['Full Stack Web Dev', 'Data Science & ML', 'React Native'];
const students = [
  { id: '1', name: 'Rahul Verma' },
  { id: '2', name: 'Priya Singh' },
  { id: '3', name: 'Amit Kumar' },
  { id: '4', name: 'Neha Reddy' },
  { id: '5', name: 'Karan Mehta' },
  { id: '6', name: 'Kavya Patel' },
  { id: '7', name: 'Arjun Nair' },
  { id: '8', name: 'Sneha Gupta' },
];

const pastRecords = [
  { date: '2024-03-11', course: 'Full Stack Web Dev', present: 30, total: 35 },
  { date: '2024-03-10', course: 'Data Science & ML', present: 22, total: 24 },
  { date: '2024-03-09', course: 'React Native', present: 15, total: 18 },
  { date: '2024-03-08', course: 'Full Stack Web Dev', present: 28, total: 35 },
  { date: '2024-03-07', course: 'Data Science & ML', present: 21, total: 24 },
];

export default function TeacherAttendance() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(students.map(s => [s.id, true]))
  );

  const toggleAttendance = (id: string) => setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Mark and manage student attendance</p>
        </div>

        {/* Mark Attendance */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
              Mark Attendance — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            <div className="flex gap-2">
              {courses.map(c => (
                <button key={c} onClick={() => setSelectedCourse(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCourse === c ? 'text-white' : 'bg-muted text-muted-foreground'}`}
                  style={selectedCourse === c ? { background: 'var(--gradient-primary)' } : {}}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="badge-success">{presentCount} Present</span>
            <span className="badge-primary" style={{ background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' }}>{students.length - presentCount} Absent</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {students.map(s => (
              <button key={s.id} onClick={() => toggleAttendance(s.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${attendance[s.id] ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{s.name.charAt(0)}</div>
                <span className="flex-1 text-left text-sm font-medium text-foreground">{s.name}</span>
                {attendance[s.id] ? <CheckCircle2 className="w-5 h-5" style={{ color: 'hsl(var(--success))' }} /> : <XCircle className="w-5 h-5" style={{ color: 'hsl(var(--destructive))' }} />}
              </button>
            ))}
          </div>

          <Button onClick={() => toast({ title: 'Attendance saved!' })} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
            <Save className="w-4 h-4 mr-2" />Save Attendance
          </Button>
        </div>

        {/* Past Records */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Recent Attendance Records</h2>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Date</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Present</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Attendance %</th>
            </tr></thead>
            <tbody>
              {pastRecords.map((r, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5 text-foreground">{new Date(r.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                  <td className="py-3 px-5 text-muted-foreground">{r.course}</td>
                  <td className="py-3 px-5 text-foreground font-medium">{r.present}/{r.total}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 progress-bar"><div className="progress-fill" style={{ width: `${Math.round((r.present / r.total) * 100)}%` }} /></div>
                      <span className="text-xs font-medium" style={{ color: 'hsl(var(--success))' }}>{Math.round((r.present / r.total) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
