import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockAssignments } from '@/data/mockData';
import { FileText, Upload, Clock, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function StudentAssignments() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [search, setSearch] = useState('');

  const filtered = mockAssignments.filter(a =>
    (filter === 'all' || a.status === filter) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    all: mockAssignments.length,
    pending: mockAssignments.filter(a => a.status === 'pending').length,
    submitted: mockAssignments.filter(a => a.status === 'submitted').length,
    graded: mockAssignments.filter(a => a.status === 'graded').length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">My Assignments</h1>
            <p className="text-muted-foreground text-sm mt-1">View, submit, and track your assignments</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([
            { label: 'Total', count: counts.all, gradient: 'var(--gradient-primary)', icon: FileText },
            { label: 'Pending', count: counts.pending, gradient: 'var(--gradient-warning)', icon: Clock },
            { label: 'Submitted', count: counts.submitted, gradient: 'var(--gradient-info)', icon: Upload },
            { label: 'Graded', count: counts.graded, gradient: 'var(--gradient-success)', icon: CheckCircle2 },
          ] as const).map(({ label, count, gradient, icon: Icon }) => (
            <div key={label} className="stat-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: gradient }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-display font-bold text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search assignments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'submitted', 'graded'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                style={filter === f ? { background: 'var(--gradient-primary)' } : {}}>
                {f} ({counts[f]})
              </button>
            ))}
          </div>
        </div>

        {/* Assignment Cards */}
        <div className="space-y-4">
          {filtered.map(a => (
            <div key={a.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    <span className={a.status === 'pending' ? 'badge-warning' : a.status === 'submitted' ? 'badge-info' : 'badge-success'}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{a.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{a.courseName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due: {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {a.grade !== undefined && (
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <CheckCircle2 className="w-3 h-3" style={{ color: 'hsl(var(--success))' }} />
                        Grade: {a.grade}/100
                      </span>
                    )}
                  </div>
                  {a.feedback && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Instructor Feedback</div>
                      <p className="text-sm text-foreground">{a.feedback}</p>
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2">
                  {a.status === 'pending' && (
                    <Button size="sm" style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
                      <Upload className="w-3 h-3 mr-1" />Submit
                    </Button>
                  )}
                  {a.status === 'submitted' && (
                    <Button size="sm" variant="outline" className="font-medium text-xs">View Submission</Button>
                  )}
                  {a.status === 'graded' && (
                    <Button size="sm" variant="outline" className="font-medium text-xs">View Details</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No assignments found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
