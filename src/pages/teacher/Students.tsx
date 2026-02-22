import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Search, Eye, Mail, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const students = [
  { id: '1', name: 'Rahul Verma', email: 'rahul@email.com', course: 'Full Stack Web Dev', progress: 68, attendance: 87, grade: 'B+', status: 'active', lastSeen: '2h ago' },
  { id: '2', name: 'Priya Singh', email: 'priya@email.com', course: 'Data Science & ML', progress: 42, attendance: 92, grade: 'A-', status: 'active', lastSeen: '1d ago' },
  { id: '3', name: 'Amit Kumar', email: 'amit@email.com', course: 'Full Stack Web Dev', progress: 91, attendance: 95, grade: 'A+', status: 'active', lastSeen: '3h ago' },
  { id: '4', name: 'Neha Reddy', email: 'neha@email.com', course: 'React Native', progress: 25, attendance: 60, grade: 'C', status: 'at-risk', lastSeen: '5d ago' },
  { id: '5', name: 'Karan Mehta', email: 'karan@email.com', course: 'Full Stack Web Dev', progress: 55, attendance: 78, grade: 'B', status: 'active', lastSeen: '2d ago' },
  { id: '6', name: 'Kavya Patel', email: 'kavya@email.com', course: 'Data Science & ML', progress: 78, attendance: 88, grade: 'A', status: 'active', lastSeen: '1h ago' },
  { id: '7', name: 'Arjun Nair', email: 'arjun@email.com', course: 'Full Stack Web Dev', progress: 35, attendance: 65, grade: 'C+', status: 'at-risk', lastSeen: '4d ago' },
];

export default function TeacherStudents() {
  const [search, setSearch] = useState('');
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
  const atRisk = students.filter(s => s.status === 'at-risk').length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage enrolled students across your courses</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Users className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{students.length}</div><div className="text-xs text-muted-foreground">Total Students</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{students.length - atRisk}</div><div className="text-xs text-muted-foreground">Active</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--destructive)/0.15)' }}><Users className="w-5 h-5" style={{ color: 'hsl(var(--destructive))' }} /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{atRisk}</div><div className="text-xs text-muted-foreground">At Risk</div></div>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Student</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Progress</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Attendance</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Grade</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{s.name.charAt(0)}</div>
                      <div><div className="font-medium text-foreground text-xs">{s.name}</div><div className="text-[10px] text-muted-foreground">{s.email}</div></div>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{s.course}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 progress-bar"><div className="progress-fill" style={{ width: `${s.progress}%` }} /></div>
                      <span className="text-xs text-muted-foreground">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-xs font-medium" style={{ color: s.attendance >= 80 ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>{s.attendance}%</td>
                  <td className="py-3 px-5 font-bold text-foreground text-xs">{s.grade}</td>
                  <td className="py-3 px-5"><span className={s.status === 'active' ? 'badge-success' : 'badge-warning'} style={s.status === 'at-risk' ? { background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' } : {}}>{s.status}</span></td>
                  <td className="py-3 px-5">
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Mail className="w-3.5 h-3.5" /></button>
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
