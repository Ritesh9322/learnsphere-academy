import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Eye, MessageSquare, Clock, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AssignmentRow {
  id: string; title: string; description: string | null; due_date: string | null; course_id: string;
  courses?: { title: string };
}

export default function TeacherAssignments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('assignments').select('*, courses(title)').order('created_at', { ascending: false }).then(({ data }) => {
      setAssignments(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = assignments.filter((a: any) => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground text-sm mt-1">Create assignments and grade student submissions</p>
          </div>
          <Button onClick={() => navigate(`/${user?.role}/assignments/create`)} style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Plus className="w-4 h-4 mr-2" />Create Assignment</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search assignments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No assignments found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((a: any) => (
              <div key={a.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.courses?.title || 'Unknown Course'}</p>
                  </div>
                  {a.due_date && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />Due {new Date(a.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                {a.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{a.description}</p>}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs flex-1"><Eye className="w-3 h-3 mr-1" />View</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
