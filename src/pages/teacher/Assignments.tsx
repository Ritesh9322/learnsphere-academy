import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Plus, CheckCircle2, Clock, Search, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const assignments = [
  { id: '1', title: 'Build a REST API with Node.js', course: 'Full Stack Web Dev', dueDate: '2024-03-20', submissions: 28, graded: 22, total: 35 },
  { id: '2', title: 'React Dashboard Component', course: 'Full Stack Web Dev', dueDate: '2024-03-30', submissions: 15, graded: 8, total: 35 },
  { id: '3', title: 'Implement Linear Regression Model', course: 'Data Science & ML', dueDate: '2024-03-18', submissions: 20, graded: 20, total: 24 },
  { id: '4', title: 'Mobile App Prototype', course: 'React Native', dueDate: '2024-03-25', submissions: 12, graded: 5, total: 18 },
];

const recentSubmissions = [
  { student: 'Rahul Verma', assignment: 'Build REST API', time: '2h ago', status: 'ungraded' },
  { student: 'Priya Singh', assignment: 'Linear Regression', time: '5h ago', status: 'ungraded' },
  { student: 'Amit Kumar', assignment: 'React Dashboard', time: '1d ago', status: 'graded', grade: 92 },
  { student: 'Neha Reddy', assignment: 'Mobile Prototype', time: '1d ago', status: 'graded', grade: 78 },
  { student: 'Karan Mehta', assignment: 'Build REST API', time: '2d ago', status: 'graded', grade: 85 },
];

export default function TeacherAssignments() {
  const [search, setSearch] = useState('');
  const filtered = assignments.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground text-sm mt-1">Create assignments and grade student submissions</p>
          </div>
          <Button style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Plus className="w-4 h-4 mr-2" />Create Assignment</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search assignments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        {/* Assignment Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(a => (
            <div key={a.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.course}</p>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Due {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{a.submissions}</div>
                  <div className="text-[10px] text-muted-foreground">Submitted</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: 'hsl(var(--success))' }}>{a.graded}</div>
                  <div className="text-[10px] text-muted-foreground">Graded</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: 'hsl(var(--warning))' }}>{a.submissions - a.graded}</div>
                  <div className="text-[10px] text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-muted-foreground">{a.total}</div>
                  <div className="text-[10px] text-muted-foreground">Total Students</div>
                </div>
              </div>
              <div className="progress-bar mb-3">
                <div className="progress-fill" style={{ width: `${Math.round((a.submissions / a.total) * 100)}%` }} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs flex-1"><Eye className="w-3 h-3 mr-1" />View</Button>
                <Button size="sm" style={{ background: 'var(--gradient-primary)' }} className="text-xs flex-1 font-semibold"><MessageSquare className="w-3 h-3 mr-1" />Grade</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Submissions */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Recent Submissions</h2>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Student</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Assignment</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Submitted</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Grade</th>
            </tr></thead>
            <tbody>
              {recentSubmissions.map((s, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5 font-medium text-foreground">{s.student}</td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{s.assignment}</td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{s.time}</td>
                  <td className="py-3 px-5"><span className={s.status === 'graded' ? 'badge-success' : 'badge-warning'}>{s.status}</span></td>
                  <td className="py-3 px-5 font-bold" style={{ color: 'hsl(var(--primary))' }}>{s.grade ? `${s.grade}/100` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
