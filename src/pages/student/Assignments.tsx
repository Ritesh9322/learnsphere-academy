import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Clock, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function StudentAssignments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      // Get enrolled course IDs
      const { data: enrollments } = await supabase.from('enrollments').select('course_id').eq('student_id', user.id);
      const courseIds = (enrollments || []).map(e => e.course_id);

      let assignmentData: any[] = [];
      if (courseIds.length > 0) {
        const { data } = await supabase.from('assignments').select('*, courses(title)').in('course_id', courseIds).order('created_at', { ascending: false });
        assignmentData = data || [];
      }

      const { data: subData } = await supabase.from('submissions').select('*').eq('student_id', user.id);
      setAssignments(assignmentData);
      setSubmissions(subData || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const getSubmission = (assignmentId: string) => submissions.find(s => s.assignment_id === assignmentId);
  const getStatus = (a: any) => {
    const sub = getSubmission(a.id);
    if (sub?.grade != null) return 'graded';
    if (sub) return 'submitted';
    return 'pending';
  };

  const filtered = assignments.filter(a => {
    const status = getStatus(a);
    return (filter === 'all' || status === filter) && a.title.toLowerCase().includes(search.toLowerCase());
  });

  const counts = {
    all: assignments.length,
    pending: assignments.filter(a => getStatus(a) === 'pending').length,
    submitted: assignments.filter(a => getStatus(a) === 'submitted').length,
    graded: assignments.filter(a => getStatus(a) === 'graded').length,
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground text-sm mt-1">View, submit, and track your assignments</p>
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
          {filtered.map(a => {
            const status = getStatus(a);
            const sub = getSubmission(a.id);
            return (
              <div key={a.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{a.title}</h3>
                      <span className={status === 'pending' ? 'badge-warning' : status === 'submitted' ? 'badge-info' : 'badge-success'}>
                        {status}
                      </span>
                    </div>
                    {a.description && <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{a.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{a.courses?.title}</span>
                      {a.due_date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />Due: {new Date(a.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      {sub?.grade != null && (
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <CheckCircle2 className="w-3 h-3" style={{ color: 'hsl(var(--success))' }} />Grade: {sub.grade}/{a.total_marks || 100}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <Button size="sm" variant="outline" className="font-medium text-xs" onClick={() => navigate(`/student/assignments/${a.id}`)}>
                      {status === 'pending' ? <><Upload className="w-3 h-3 mr-1" />Submit</> : 'View Details'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
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
