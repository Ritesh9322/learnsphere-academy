import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockEnrollments } from '@/data/mockData';
import { CalendarDays, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';

const attendanceData = [
  { date: '2024-03-11', course: 'Full Stack Web Dev', status: 'present' },
  { date: '2024-03-10', course: 'Data Science & ML', status: 'present' },
  { date: '2024-03-09', course: 'UI/UX Design', status: 'present' },
  { date: '2024-03-08', course: 'Full Stack Web Dev', status: 'absent' },
  { date: '2024-03-07', course: 'Data Science & ML', status: 'present' },
  { date: '2024-03-06', course: 'Full Stack Web Dev', status: 'present' },
  { date: '2024-03-05', course: 'UI/UX Design', status: 'present' },
  { date: '2024-03-04', course: 'Data Science & ML', status: 'present' },
  { date: '2024-03-03', course: 'Full Stack Web Dev', status: 'late' },
  { date: '2024-03-02', course: 'UI/UX Design', status: 'present' },
  { date: '2024-03-01', course: 'Data Science & ML', status: 'absent' },
  { date: '2024-02-29', course: 'Full Stack Web Dev', status: 'present' },
];

const courseAttendance = [
  { course: 'Full Stack Web Development', present: 28, total: 32, percentage: 87.5 },
  { course: 'Data Science & ML', present: 22, total: 25, percentage: 88 },
  { course: 'UI/UX Design Fundamentals', present: 18, total: 20, percentage: 90 },
];

const presentCount = attendanceData.filter(a => a.status === 'present').length;
const absentCount = attendanceData.filter(a => a.status === 'absent').length;
const lateCount = attendanceData.filter(a => a.status === 'late').length;
const overallPct = Math.round((presentCount / attendanceData.length) * 100);

export default function StudentAttendance() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your class attendance across all courses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{overallPct}%</div><div className="text-xs text-muted-foreground">Overall</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><CheckCircle2 className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{presentCount}</div><div className="text-xs text-muted-foreground">Present</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><Clock className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{lateCount}</div><div className="text-xs text-muted-foreground">Late</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--destructive)/0.15)' }}><XCircle className="w-5 h-5" style={{ color: 'hsl(var(--destructive))' }} /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{absentCount}</div><div className="text-xs text-muted-foreground">Absent</div></div>
          </div>
        </div>

        {/* Course-wise Attendance */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-foreground mb-4">Course-wise Attendance</h2>
          <div className="space-y-5">
            {courseAttendance.map(c => (
              <div key={c.course}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">{c.course}</div>
                    <div className="text-xs text-muted-foreground">{c.present}/{c.total} classes attended</div>
                  </div>
                  <span className={`text-sm font-bold ${c.percentage >= 85 ? '' : ''}`} style={{ color: c.percentage >= 85 ? 'hsl(var(--success))' : c.percentage >= 75 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))' }}>
                    {c.percentage}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance Log */}
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
              {attendanceData.map((a, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5 text-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                      {new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-muted-foreground">{a.course}</td>
                  <td className="py-3 px-5">
                    <span className={a.status === 'present' ? 'badge-success' : a.status === 'late' ? 'badge-warning' : 'badge-primary'} style={a.status === 'absent' ? { background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' } : {}}>
                      {a.status === 'present' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                      {a.status === 'absent' && <XCircle className="w-3 h-3 mr-1 inline" />}
                      {a.status === 'late' && <Clock className="w-3 h-3 mr-1 inline" />}
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
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
